import Domo from "@zyrab/domo";
import { fetchHistory, auth } from "../firebase.js";
import { generateQRCode } from "../utils.js";

export const History = () => {
  const listContainer = Domo("div").cls("flex f-col g-2");
  const wrapper = Domo("div")
    .cls("card hidden")
    .child([Domo("h2").txt("Your Library").cls("h2"), listContainer]);

  const loadData = async (user) => {
    listContainer.clear();
    wrapper.rmvCls("hidden");
    listContainer.child([Domo("div").txt("Loading...")]);
    const items = await fetchHistory(user);
    listContainer.clear();
    if (items.length === 0) {
      listContainer.child([Domo("p").txt("No saved codes yet.").cls("small")]);
      return;
    }

    items.forEach((item) => {
      const row = Domo("div")
        .cls("flex jsb aic p-1")
        .css({ borderBottom: "1px solid var(--border)" })
        .child([
          Domo("span").txt(item.text).css({
            fontWeight: "500",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "70%",
          }),
          Domo("button")
            .txt("Load")
            .cls("btn")
            .on("click", () => {
              const canvas = document.getElementById("qr-output");
              const input = document.querySelector("input[type=text]");
              if (input) input.value = item.text;
              if (canvas) generateQRCode(canvas, item.text, item.logoBase64);
            }),
        ]);
      listContainer.child([row]);
    });
  };

  document.addEventListener("app:login", (e) => loadData(e.detail));
  document.addEventListener("app:refresh-history", () => {
    if (auth.currentUser) loadData(auth.currentUser);
  });

  document.addEventListener("app:logout", () => {
    wrapper.cls("hidden");
    listContainer.clear();
  });

  return wrapper;
};
