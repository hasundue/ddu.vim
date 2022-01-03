import { BaseUi, DduItem, UiOptions } from "../ddu/types.ts";
import { Denops, fn, vars } from "../ddu/deps.ts";

type Params = Record<never, never>;

export class Ui extends BaseUi<Params> {
  async redraw(args: {
    denops: Denops;
    uiOptions: UiOptions;
    items: DduItem[];
  }): Promise<void> {
    const bufferName = `ddu-std-${args.uiOptions.bufferName}`;
    let bufnr;
    if (await fn.bufexists(args.denops, bufferName)) {
      bufnr = await fn.bufnr(args.denops, bufferName);
    } else {
      // Initialize buffer
      bufnr = await fn.bufadd(args.denops, bufferName);
      await fn.bufload(args.denops, bufnr);
    }

    await fn.setbufvar(args.denops, bufnr, "&filetype", "ddu-std");

    await fn.setbufvar(args.denops, bufnr, "&modifiable", 1);
    await fn.deletebufline(args.denops, bufnr, 1, "$");

    // Note: Use only 1000 items
    const items = args.items.slice(0, 1000);
    await fn.setbufline(args.denops, bufnr, 1, items.map((c) => c.word));

    await fn.setbufvar(args.denops, bufnr, "&modifiable", 0);
    await fn.setbufvar(args.denops, bufnr, "&modified", 0);

    await args.denops.cmd(`buffer ${bufnr}`);
    await vars.b.set(args.denops, "ddu_ui_std_items", args.items);
  }

  params(): Params {
    return {};
  }
}
