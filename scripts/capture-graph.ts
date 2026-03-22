#!/usr/bin/env bun

import { once } from 'node:events'
import { mkdir } from 'node:fs/promises'
import { spawn, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'
import { siteBasePath } from '../site.config'

const HOST = '127.0.0.1'
const PORT = 4173
const SERVER_URL = `http://${HOST}:${PORT}${siteBasePath}?capture=graph-square`
const OUTPUT_PATH = path.resolve(process.cwd(), 'public/graph-square.png')
const SERVER_BOOT_TIMEOUT_MS = 30_000
const SHUTDOWN_TIMEOUT_MS = 5_000
const CHART_CARD_SELECTOR = '.chart-card'

async function waitForServer(url: string) {
  const deadline = Date.now() + SERVER_BOOT_TIMEOUT_MS

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' })
      if (response.ok) {
        return
      }
    } catch {
      // Keep polling until the dev server comes up or the timeout expires.
    }

    await delay(250)
  }

  throw new Error(`Timed out waiting for the capture server at ${url}.`)
}

function startServer(): ChildProcess {
  return spawn(
    process.execPath,
    ['x', 'vite', '--host', HOST, '--port', `${PORT}`, '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        BROWSER: 'none',
      },
    },
  )
}

async function stopServer(serverProcess: ChildProcess) {
  if (serverProcess.exitCode !== null) {
    return
  }

  serverProcess.kill('SIGTERM')

  const exitPromise = once(serverProcess, 'exit').then(() => undefined)
  const timeoutPromise = delay(SHUTDOWN_TIMEOUT_MS).then(() => 'timeout')
  const result = await Promise.race([exitPromise, timeoutPromise])

  if (result === 'timeout') {
    serverProcess.kill('SIGKILL')
    await once(serverProcess, 'exit')
  }
}

async function captureGraph() {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })

  const serverProcess = startServer()
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await waitForServer(SERVER_URL)

    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1440 },
      colorScheme: 'dark',
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()

    await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForFunction(() => document.fonts?.status === 'loaded')

    const captureSurface = page.getByTestId('graph-square-capture')
    await captureSurface.waitFor({ state: 'visible', timeout: 15_000 })
    const chartCard = captureSurface.locator(CHART_CARD_SELECTOR)
    await chartCard.waitFor({ state: 'visible', timeout: 15_000 })

    await chartCard.screenshot({
      path: OUTPUT_PATH,
      type: 'png',
      animations: 'disabled',
    })

    await context.close()
  } finally {
    if (browser) {
      await browser.close()
    }

    await stopServer(serverProcess)
  }
}

await captureGraph()
