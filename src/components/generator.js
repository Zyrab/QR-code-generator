import Domo from "@zyrab/domo";
import { generateQRCode, downloadCanvas, resizeImage } from "../utils.js";
import { saveQrToHistory, auth } from "../firebase.js";

export const Generator = () => {
  let currentLogo = null;
  const canvasEl = Domo("canvas").id("qr-output").build();

  const textInput = Domo("input")
    .attr({
      type: "text",
      placeholder: "Enter URL or text...",
    })
    .cls("input");

  const fileInput = Domo("input")
    .attr({
      type: "file",
      accept: "image/*",
    })
    .cls("input")
    .on("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        currentLogo = e.target.files[0];
      }
    });

  const handleGenerate = async () => {
    const text = textInput.element.value;
    if (!text) return alert("Please enter text");

    await generateQRCode(canvasEl, text, currentLogo);

    if (auth.currentUser) {
      const btn = document.querySelector(".btn-primary");
      if (btn) btn.textContent = "Saving...";

      try {
        let logoBase64 = null;

        if (currentLogo) {
          logoBase64 = await resizeImage(currentLogo, 100);
        }

        await saveQrToHistory(auth.currentUser, text, logoBase64);

        document.dispatchEvent(new CustomEvent("app:refresh-history"));
      } catch (err) {
        console.error(err);
      } finally {
        if (btn) btn.textContent = "Generate & Save";
      }
    }
  };

  return Domo("main")
    .cls("flex f-col g-3 w-full")
    .child([
      Domo("div")
        .cls("card flex f-col g-2")
        .child([
          Domo("h2").txt("Create QR").cls("h2"),
          textInput,
          Domo("div")
            .cls("flex f-col")
            .child([Domo("span").txt("Add Logo (Optional)").cls("small"), fileInput]),
          Domo("button").txt("Generate QR Code").cls("btn btn-primary").on("click", handleGenerate),
        ]),

      Domo("div")
        .cls("card flex f-col aic g-3")
        .child([
          Domo("div").cls("qr-container").child([canvasEl]),
          Domo("button")
            .txt("Download PNG")
            .cls("btn")
            .on("click", () => downloadCanvas(canvasEl)),
        ]),
    ]);
};
