// Helpers for writing QA reports to disk
import * as fs from 'fs'
import * as path from 'path'

const REPORTS_DIR = path.resolve(__dirname, '../reports')

function ensureDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }
}

export interface QAIssue {
  page: string
  category: 'contrast' | 'accessibility' | 'layout' | 'functional' | 'console-error' | 'network-error'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  title: string
  description: string
  selector?: string
  screenshot?: string
  recommendation?: string
}

export function writeContrastReport(issues: Array<Record<string, unknown>>) {
  ensureDir()
  const filePath = path.join(REPORTS_DIR, 'ui-contrast-report.json')
  fs.writeFileSync(filePath, JSON.stringify(issues, null, 2))
  return filePath
}

export function writeErrorReport(errors: Array<Record<string, unknown>>) {
  ensureDir()
  const filePath = path.join(REPORTS_DIR, 'qa-error-report.json')
  fs.writeFileSync(filePath, JSON.stringify(errors, null, 2))
  return filePath
}

export function writeAccessibilityReport(violations: Array<Record<string, unknown>>) {
  ensureDir()
  const filePath = path.join(REPORTS_DIR, 'accessibility-report.json')
  fs.writeFileSync(filePath, JSON.stringify(violations, null, 2))
  return filePath
}

export function appendToReport(fileName: string, data: Record<string, unknown>) {
  ensureDir()
  const filePath = path.join(REPORTS_DIR, fileName)
  let existing: Array<Record<string, unknown>> = []
  if (fs.existsSync(filePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch { /* start fresh */ }
  }
  existing.push(data)
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2))
}

export function writeSummaryReport(summary: {
  timestamp: string
  totalPages: number
  critical: QAIssue[]
  serious: QAIssue[]
  moderate: QAIssue[]
  minor: QAIssue[]
}) {
  ensureDir()
  const filePath = path.join(REPORTS_DIR, 'qa-summary.json')
  fs.writeFileSync(filePath, JSON.stringify(summary, null, 2))
  return filePath
}
