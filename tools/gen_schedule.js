const fs = require('fs');
const path = 'frontend/CS 415 515 Planning Schedule.csv';
const text = fs.readFileSync(path, 'utf8').replace(/\r/g, '');
const lines = text.trim().split('\n');
const out = [];
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  if (cols.length < 11) continue;
  const week = cols[0] || null;
  const date = cols[1] || '';
  const note = cols[4] || '';
  const lecture = cols[8] || '';
  let reading = cols[10] || '';
  const lectureTopic = (lecture || note || '').trim();
  if (!reading.trim() && /^No class/i.test(lectureTopic)) {
    reading = 'no reading';
  }
  out.push({
    week: week ? Number(week) : null,
    date,
    lectureTopic,
    readingTopic: reading.trim(),
    materials: [],
  });
}
const linesOut = out.map(o =>
  `  { week: ${o.week === null ? 'null' : o.week}, date: ${JSON.stringify(o.date)}, lectureTopic: ${JSON.stringify(o.lectureTopic)}, readingTopic: ${JSON.stringify(o.readingTopic)}, materials: [] },`
);
console.log(linesOut.join('\n'));
