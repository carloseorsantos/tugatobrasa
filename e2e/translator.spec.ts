import { test, expect } from "@playwright/test";

test("fluxo feliz: digitar, traduzir, ver badge de registro", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Palavra ou frase para traduzir").fill("fixe");
  await page.getByRole("button", { name: "Traduzir" }).click();

  const result = page.locator("#resultado");
  await expect(result.locator(".headword")).toHaveText("legal");
  await expect(result.locator(".ds-badge-pos")).toHaveText("gír.");
});

test("falso amigo: banner de alerta aparece destacado", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Palavra ou frase para traduzir").fill("bicha");
  await page.getByRole("button", { name: "Traduzir" }).click();

  const alert = page.locator("#resultado .ds-ff-alert");
  await expect(alert).toBeVisible();
  await expect(alert.getByText("Falso amigo")).toBeVisible();
});

test("toggle de direção inverte rótulos e placeholder", async ({ page }) => {
  await page.goto("/");
  const direction = page.getByRole("group", { name: "Direção da tradução" });
  await expect(direction.locator(".dir").first()).toContainText("Portugal");

  await page.getByRole("button", { name: "Inverter direção da tradução" }).click();

  await expect(direction.locator(".dir").first()).toContainText("Brasil");
  await expect(page.getByLabel("Palavra ou frase para traduzir")).toHaveAttribute(
    "placeholder",
    "digite uma palavra ou gíria"
  );
});

test("termo desconhecido: sugestões e link de contribuição", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Palavra ou frase para traduzir").fill("termoxyzinventado12345");
  await page.getByRole("button", { name: "Traduzir" }).click();

  const result = page.locator("#resultado");
  await expect(result.locator(".nf-word")).toHaveText("termoxyzinventado12345");
  const contribute = result.getByRole("link", { name: "Contribuir com este termo" });
  await expect(contribute).toBeVisible();
  await expect(contribute).toHaveAttribute(
    "href",
    /github\.com\/carloseorsantos\/tugatobrasa-api\/issues\/new\?template=novo-termo\.yml&termo=/
  );
});

test("fluxo 100% por teclado: digitar, Enter, ver resultado — sem mouse", async ({ page }) => {
  await page.goto("/");
  // autoFocus já deixa o input focado no load — nenhum clique de mouse neste teste
  await page.keyboard.type("autocarro");
  await page.keyboard.press("Enter");

  await expect(page.locator("#resultado .headword")).toHaveText("ônibus");
});

test("toggle de direção alcançável por teclado (Shift+Tab a partir do input)", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Palavra ou frase para traduzir").focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Inverter direção da tradução" })).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.getByRole("group", { name: "Direção da tradução" }).locator(".dir").first()).toContainText(
    "Brasil"
  );
});
