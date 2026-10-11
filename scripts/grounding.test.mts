import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isGrounded } from '../src/lib/grounding.ts'

const BASED =
  '[Where Harshal is based] Based in Mumbai, IST (UTC+5:30). Open to work in Mumbai, Pune or Bangalore.\n' +
  '[Resume Roaster] Year 2023. Built with Next.js, PostgreSQL, Prisma, and Tailwind CSS, it integrates GPT-4.'
const RAG =
  '[Retrieval (RAG)] Vector retrieval over document corpora that grounds answers.\n' +
  '[S-04 Conversational assistant] Stack: FastAPI, React, LangChain, Vector DB, Gemini.'

test('accepts replies that only restate the passages', () => {
  assert.ok(isGrounded('Harshal is based in Mumbai.', BASED, 'where are you based'))
  assert.ok(isGrounded('Harshal is based in Mumbai, IST (UTC+5:30), and open to work in Pune or Bangalore.', BASED, 'where'))
  assert.ok(isGrounded('He built Resume Roaster in 2023 with Next.js and GPT-4.', BASED, 'resume roaster'))
  assert.ok(isGrounded('He builds RAG with LangChain and FastAPI. I do not know more than that.', RAG, 'how do you build rag'))
})

test('sentence-initial capitals and the allowlist do not need to appear in passages', () => {
  assert.ok(isGrounded('Yes. Harshal Lade works in Mumbai.', BASED, 'q'))
  assert.ok(isGrounded('Probe does not know. Check the site.', BASED, 'q'))
})

test('rejects numbers that are not in the passages', () => {
  assert.equal(isGrounded('Harshal grew revenue 40% in Mumbai.', BASED, 'q'), false)
  assert.equal(isGrounded('Harshal has 7 years of experience.', BASED, 'q'), false)
  assert.equal(isGrounded('Call him on 98200 12345.', BASED, 'q'), false)
  assert.equal(isGrounded('He started in 2021.', BASED, 'q'), false)
})

test('a number that only appears inside a longer number in the passages is not grounded', () => {
  // "3" and "20" are substrings of "2023" and "5:30" but are not numbers in the passages
  assert.equal(isGrounded('He shipped 3 products.', BASED, 'q'), false)
  assert.equal(isGrounded('He led 20 engineers.', BASED, 'q'), false)
})

test('numbers in the visitor question count as grounded', () => {
  assert.ok(isGrounded('Harshal is not in 2019 records but is based in Mumbai.', BASED, 'what about 2019'))
})

test('rejects emails and links that are not in the passages', () => {
  assert.equal(isGrounded('Email him at harshal@example.com.', BASED, 'q'), false)
  assert.equal(isGrounded('See https://evil.example for more.', BASED, 'q'), false)
  assert.equal(isGrounded('See www.example.com for more.', BASED, 'q'), false)
})

test('an email that appears in the passages is allowed', () => {
  const withMail = `${BASED}\n[Contact] Email owner@example.com.`
  assert.ok(isGrounded('You can email owner@example.com.', withMail, 'how to contact'))
})

test('rejects proper nouns the passages never mention', () => {
  assert.equal(isGrounded('Harshal worked at Google in Mumbai.', BASED, 'q'), false)
  assert.equal(isGrounded('He builds RAG with LlamaIndex and FastAPI.', RAG, 'how do you build rag'), false)
  assert.equal(isGrounded('He holds a degree from Stanford University.', BASED, 'q'), false)
})

test('an invented proper noun at the start of a sentence is still rejected', () => {
  assert.equal(isGrounded('Harshal is in Mumbai. Google hired him.', BASED, 'q'), false)
  assert.equal(isGrounded('Microsoft is where he works.', BASED, 'q'), false)
})

test('common sentence starters are fine without appearing in the passages', () => {
  for (const t of [
    'He is based in Mumbai.',
    'His base is Mumbai.',
    'The answer is Mumbai.',
    'Yes, he is in Mumbai.',
    'No, he is in Mumbai.',
    'Sorry, the site only says Mumbai.',
    'This site says he is in Mumbai.',
    'There is no more detail than Mumbai.',
    'Currently he is in Mumbai.',
    'Based in Mumbai.',
  ])
    assert.ok(isGrounded(t, BASED, 'q'), t)
})

test('proper nouns are matched case-insensitively as whole words', () => {
  assert.ok(isGrounded('He uses Postgresql and Prisma.', BASED, 'q'))
  // "Act" is inside "React" but is not a word in the passages
  assert.equal(isGrounded('He follows the Act framework.', RAG, 'q'), false)
})

test('a proper noun from the visitor question is grounded', () => {
  assert.ok(isGrounded('Harshal has not mentioned Kafka, but he works with FastAPI.', RAG, 'do you know kafka'))
})
