# Änderungsprotokoll / Changelog

## 5.0.1 — 2026-07-29

### de
- Projekte, die schon vor der Umstellung des Antragswegs (siehe Version 5.0.0) begonnen wurden, blieben teils im Antragsweg-Assistenten hängen oder zeigten einen Fehler. Das ist jetzt behoben, alte Projekte werden automatisch auf den neuen Ablauf umgestellt.
- Zeilenumbrüche in den zusammengeführten Texten "Ziele und Anforderungen" sowie "Richtlinien-Check" wurden beim Anzeigen verschluckt. Die Texte werden jetzt korrekt mit Absätzen dargestellt.
- Die Überschrift des Schritts "Richtlinien-Check (Inhalt)" heißt jetzt "Richtlinien-Check (Inhalt und Formalitäten)", passend zum zusammengeführten Inhalt dieses Schritts.

### en
- Projects that were already in progress before the application-path restructure (see version 5.0.0) could get stuck in the application-path wizard or show an error. This is now fixed - older projects are automatically upgraded to the new flow.
- Line breaks in the merged "Goals and requirements" and "Guideline check" texts were being swallowed when displayed. These texts now show correctly with paragraph breaks.
- The title of the "Guideline Check (Content)" step now reads "Guideline Check (Content and Formalities)", matching the merged content of that step.

## 5.0.0 — 2026-07-28

### de
- Der Antragsweg wurde vereinfacht: "Ziele definieren" und "Anforderungen definieren" sind jetzt ein gemeinsamer Schritt "Ziele und Anforderungen definieren".
- Der Richtlinien-Check (Langfassung) ist jetzt ein einziger Schritt mit einem gemeinsamen Textfeld für Inhalt und Formalitäten, statt zwei getrennter Schritte.
- Der Finanzierungs-Check ist jetzt Teil der "Projektentwicklung" statt der "Antragsstellung".

### en
- The application path has been simplified: "Define goals" and "Define requirements" are now a single combined step "Define goals and requirements".
- The guideline check (long version) is now a single step with one combined text field for content and formalities, instead of two separate steps.
- The financing check is now part of "Project development" instead of "Application".

## 4.2.2 — 2026-07-28

### de
- Im ersten Schritt der Projekterstellung sind "Projektziele", "Projektinhalt" und "Projektmehrwert & -nutzen" jetzt Pflichtfelder (wie die Ausgangssituation), damit unvollständige Angaben nicht erst später bei der Fördersuche zu Problemen führen.
- Die Fehlermeldung bei der Fördersuche nennt jetzt genau, welche Angaben aus Schritt 1 fehlen, statt nur allgemein "keine Projektdaten verfügbar" zu melden.

### en
- In the first project creation step, "Project Goals", "Project Content" and "Project Value & Benefits" are now required fields (like the Starting Condition), so incomplete entries don't cause problems later during the funding search.
- The funding search error message now names exactly which details from step 1 are missing, instead of just reporting "no project data available".

## 4.2.1 — 2026-07-28

### de
- Fehlerbehebung: Beim Anlegen eines neuen Projekts wurde die KI-Fördermittelsuche nach dem ersten Schritt manchmal nicht automatisch gestartet, sodass die Schaltfläche "Förderungen aktualisieren" fälschlich einen Fehler zu fehlenden Projektdaten meldete.

### en
- Bug fix: When creating a new project, the AI funding search sometimes didn't start automatically after the first step, causing the "Update funding options" button to incorrectly report missing project data.

## 4.2.0 — 2026-07-28

### de
- Beim KI-Fördermittelcheck werden jetzt nicht mehr nur 12 Förderrichtlinien-Vorschläge angezeigt: Über "Weitere Förderrichtlinien anzeigen" lassen sich schrittweise weitere Treffer einblenden.
- Eine Förderrichtlinie aus den weiteren Treffern lässt sich per Drag & Drop nach oben in die Haupt-Auswahl ziehen.

### en
- The AI funding check no longer stops at 12 suggestions: a "Show more funding guidelines" button reveals additional matches step by step.
- A funding guideline from the additional matches can be dragged up into the main selection.

## 4.1.0 — 2026-07-25

### de
- Gemeindeleitungen können Projektideen priorisieren: Ausgewählte Projekte erscheinen in einer eigenen Liste ganz oben im Projekt-Dashboard und lassen sich per Drag & Drop in die gewünschte Reihenfolge bringen. Alle Mitarbeitenden der Gemeinde sehen diese Liste, aber nur die Gemeindeleitung kann sie verändern.
- Administratoren können die Prioritätenliste jeder Gemeinde über eine Auswahlbox einsehen und sehen, welche Leitung diese gesetzt hat.

### en
- Municipality leaders can now prioritise project ideas: selected projects appear in their own list at the top of the Project Dashboard and can be reordered by drag & drop. Everyone in the municipality can see this list, but only the leader can change it.
- Administrators can inspect any municipality's priority list via a selector and see which leader set it.

## 4.0.0 — 2026-07-25

### de
- Fördermittel-Tabellen zeigen jetzt an, ob ein Projekt förderfähig ist, mit Filtermöglichkeit danach.
- Neue Übersicht für archivierte Projekte im Dashboard (nur sichtbar für Leitungen und Admins).
- Überarbeitete Login-Seite mit neuer Registrierungsmöglichkeit für Gäste.
- Verbesserter Cookie- und Datenschutz-Hinweis, Einstellungen werden jetzt zuverlässiger gespeichert.
- Fehlerbehebung: Nutzerinnen und Nutzer sahen teils Fördermittel anderer Kommunen — jetzt korrekt auf die eigene Kommune/Bundesland eingeschränkt.
- Der Hilfe-Bereich ("?"-Symbol) zeigt jetzt zusätzlich eine Übersicht "Neuigkeiten" mit den letzten Änderungen an der Plattform, neben den bestehenden Anleitungsvideos.

### en
- Funding tables now show whether a project is eligible for funding, with a filter for it.
- New overview of archived projects on the dashboard (visible only to leaders and admins).
- Redesigned login page with a new registration option for guests.
- Improved cookie/privacy notice — settings are now saved more reliably.
- Fixed a bug where users could sometimes see funding entries from other municipalities — now correctly restricted to their own municipality/federal state.
- The help area ("?" icon) now also shows a "What's New" overview with recent platform changes, alongside the existing tutorial videos.
