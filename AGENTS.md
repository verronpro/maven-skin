# Maven-skin — AGENTS.md

Agent-agnostic guidance for working in the **maven-skin** project. This file is the standalone
guidance for this project; it does not assume any relationship to other projects.

## Role

A custom **Maven site skin** that styles Maven documentation sites. It is **documentation-only**:
it is never a runtime dependency of any library.

## General development standards

This project uses **Java 25** and **Maven**.

### Build
- `mvn clean install` — build this project.
- `mvn clean install -DskipTests` — build without running tests.
- `mvn site` — generate the Maven documentation site from `src/site/asciidoc/`.

### Testing
- JUnit 5 (Jupiter); use `@DisplayName` for descriptive names; follow Arrange-Act-Assert.
- Tests live in `src/test/java/`.
- `java.awt.headless=true` is set automatically by the Surefire plugin.

### Code style
- Java 25 features in use: records, JPMS modules (`module-info.java`), modern APIs.
- Soft line-length limit: 120 characters. Indentation: 4 spaces.
- Opening braces on the same line; `else` on a new line.
- Naming: PascalCase for classes/interfaces, camelCase for methods/variables,
  UPPER_SNAKE_CASE for constants.
- Prefer composition over inheritance; static factory methods or builders for complex objects;
  constructor injection for dependencies.
- Javadoc required for all public elements; use Markdown syntax inside Javadoc.
- Custom exceptions; do not swallow exceptions; use try-with-resources.

## Notes

- Changes here affect the look of the `mvn site` output of any project that uses this skin.
  Verify with `mvn site` after editing.
- The skin's TOC feature is documented in `TOC-README.md`, `TOC-FEATURE.md`, and `TOC-EXAMPLE.html`
  at this project root — these are the canonical references for the TOC behaviour; surface them in
  the skin site rather than leaving them orphaned.
- Keep styling consistent with common web design tokens where they overlap.
