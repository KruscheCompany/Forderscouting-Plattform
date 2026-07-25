export function parseChangelog(raw) {
  const blocks = raw
    .split(/\n(?=## )/)
    .map((b) => b.trim())
    .filter((b) => b.startsWith("## "));

  return blocks.map((block) => {
    const lines = block.split("\n");
    const headerLine = lines[0].replace(/^##\s*/, "").trim();
    const [versionPart, datePart] = headerLine.split("—").map((s) => s.trim());

    const deIndex = lines.findIndex((l) => l.trim() === "### de");
    const enIndex = lines.findIndex((l) => l.trim() === "### en");

    const extractBullets = (startIndex, endIndex) => {
      if (startIndex === -1) return [];
      const slice = lines.slice(
        startIndex + 1,
        endIndex === -1 ? lines.length : endIndex
      );
      return slice
        .map((l) => l.trim())
        .filter((l) => l.startsWith("-"))
        .map((l) => l.replace(/^-\s*/, ""));
    };

    const de = extractBullets(deIndex, enIndex);
    const en = extractBullets(enIndex, -1);

    return { version: versionPart, date: datePart, de, en };
  });
}

export function getChangelogEntries() {
  const raw = require("!!raw-loader!../../CHANGELOG.md").default;
  return parseChangelog(raw);
}
