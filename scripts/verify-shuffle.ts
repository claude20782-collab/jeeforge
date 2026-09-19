import { readFileSync } from 'fs'
const pairs = (src: string) => {
  const re = /options:\s*\[([^\]]+)\][\s\S]{0,80}?correctAnswer:\s*'([A-D])'/g
  const out: Array<{ opts: string[]; key: string }> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const opts = m[1].split(',').map(s => s.trim().replace(/^['']|['']$/g, ''))
    out.push({ opts, key: m[2] })
  }
  return out
}
const files: Array<[string, string, string]> = [
  ['/tmp/old-ph.ts', 'src/content/banks/mock-01/physics.ts', 'physics'],
  ['/tmp/old-ch.ts', 'src/content/banks/mock-01/chemistry.ts', 'chemistry'],
  ['/tmp/old-ma.ts', 'src/content/banks/mock-01/math.ts', 'math'],
]
let bad = 0
for (const [oldPath, newPath, name] of files) {
  const oldP = pairs(readFileSync(oldPath, 'utf8'))
  const newP = pairs(readFileSync(newPath, 'utf8'))
  if (oldP.length !== newP.length) { console.log(`${name}: COUNT MISMATCH old=${oldP.length} new=${newP.length}`); bad++; continue }
  oldP.forEach((o, i) => {
    const n = newP[i]
    const oldText = o.opts['ABCD'.indexOf(o.key)]
    const newText = n.opts['ABCD'.indexOf(n.key)]
    const sameSet = o.opts.slice().sort().join('|') === n.opts.slice().sort().join('|')
    if (oldText !== newText || !sameSet) { console.log(`${name} Q${i + 1}: MISMATCH oldKey=${o.key}("${oldText}") newKey=${n.key}("${newText}") sameSet=${sameSet}`); bad++ }
  })
  console.log(`${name}: ${oldP.length} MCQs checked`)
}
console.log(bad === 0 ? 'ALL SHUFFLES CONSISTENT ✓' : `PROBLEMS: ${bad}`)
