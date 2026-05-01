# AGENTS.md - 제출 전 문서 리스크 점검기

## Project

- Product name: 제출 전 문서 리스크 점검기
- Project slug: `pre-submit-document-risk-checker`
- Root path: `D:\VibeProject\CodexProjects\pre-submit-document-risk-checker`
- Owner: Ethan
- Planning / specification: Jenny
- Execution / implementation / QA: Dex

## Operating Rule

Jenny owns product judgment, PRD, IA, UX, screen spec, design direction, acceptance criteria, and review.
Dex owns file creation, implementation, document operations, browser QA, Git diff, and verifiable HTML/app output.

## Source of Truth

1. Git-managed project repo Markdown
2. Confirmed Obsidian documents
3. Jenny/Dex handoff documents
4. Graphify analysis candidates

## Required Output

Dex must provide:

- artifact location
- run command
- local URL or HTML preview path
- route list
- implemented screens
- unimplemented screens
- major changed files
- QA result
- Git diff or change summary
- assumptions
- known issues

## Product Safety

This product must not be implemented or marketed as an AI detector bypass, AI humanizer, Turnitin bypass, or guaranteed pass tool.

Allowed framing:

- pre-submit document risk check
- Korean writing reliability report
- AI writing risk signal
- source/citation risk check
- document submission readiness

Disallowed framing:

- bypass
- undetectable
- humanizer
- 100% human
- detector pass guarantee
- lowering AI detector score

## MVP Implementation Rule

Use mock data first. Do not connect real model APIs, external detectors, payment, or LMS integrations in the first MVP unless Ethan explicitly approves.
