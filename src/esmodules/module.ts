import BaseTableResult from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents/table-result.mjs";
import { MaybePromise, GetDataReturnType, InexactPartial } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import DocumentSheetV2 from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client-esm/applications/api/document-sheet.mjs';
import { randomUUID } from "crypto";
import { DOCUMENT_OWNERSHIP_LEVELS } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs";

const MODULE_ID = 'structured-table-results';

export const MODULE = {
  ns: MODULE_ID,
  path: `modules/${MODULE_ID}`,
  templatePath: `modules/${MODULE_ID}/templates/htmlInputTemplate.hbs`,
};

const log = (...args: any): void => {
  try {
    const dev_mode = game.modules?.get('_dev-mode');
    // console.log("look here vvv");
    // console.log(dev_mode);
    // const api = dev_mode?['api'];
    // api['setPackageDebugValue'](MODULE_ID, true);
    // dev_mode?.api?.setPackageDebugValue(MODULE_ID, true);
    // const isDebugging = game.modules?.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);
    const isDebugging = true; // api['getPackageDebugValue'](MODULE_ID);

    if (isDebugging || true) {
      console.log('DEBUG | ', MODULE_ID, '|', ...args);
    }
  } catch (e) {}
}


function getGame(): Game {
  if(!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}

Hooks.on("init", () => {
    CONFIG.debug.hooks = true;
    log("starting")
});

Hooks.once('devModeReady', ( registerPackageDebugFlag: (moduleId: string) => void) => {
  registerPackageDebugFlag(MODULE_ID);
  log("registered with debug mode");
});

var editor = (inputItem: HTMLInputElement) => { 
  return TextEditor.create({} as TextEditor.Options, inputItem.value);
};

class LocalTableResult extends TableResult {
  set index(index: number) {
    this.index = index;
  }
  get index(): number {
    return this.index;
  }

  get rangeText(): string {
    return `${this.range[0]}-${this.range[1]}`;
  }
}

var mutateTextInputs = async(rollTableData: RollTableConfig, html: JQuery, rollTable: RollTable) => {
  if (rollTableData.isEditable === false) {
    // This table isn't editable
    return;
  }

  const tableName = rollTableData.object.name;
  // const tableDescription = rollTable.description;
  const results = rollTable.results;

  let textResults = results
  // turn the result into a LocalResult so we can add the index
  .map((result: TableResult, index: number) => {
    let localResult = result as LocalTableResult;
    localResult.index = index;
    return localResult;
  })
  // filter out any results which aren't of the text type (documents and other tables)
  .filter((result: LocalTableResult) => {
    return `${result.type}` === CONST.TABLE_RESULT_TYPES.TEXT;
  })

  log(textResults);

  textResults.forEach((result: LocalTableResult) => {
    // let row = html.find(`tr.table-result`)[result.index];
    // let resultCell = html.find(`tr.table-result:nth-child(${result.index + 1}].result-details`);

    let resultCell = html.find(`tr.table-result:nth-child(${result.index + 1}) .result-details`);
    let button = document.createElement('button') as HTMLButtonElement;
      button.type = "button";
      button.textContent = "html"; // text on the button
      button.onclick = () => new RollTableTextHelper(result, tableName).render(true);
      button.style.width = "4em";
      button.style.padding = "0 0 0 0";
      let resultTextInput = resultCell?.find(`input[type=text]`);
      resultTextInput.addClass("str-shorter-table-input")
      resultTextInput.length -= 4;
      resultCell.append(button);
  })
  };  

export class RollTableTextHelper extends FormApplication {
  itemResult: LocalTableResult;
  windowTitle: string;

  protected _updateObject(event: Event, formData: {text: string}): Promise<unknown> {
    // const form = foundry.utils.expandObject(formData);

    // this.inputElement.value = formData?['value'];
    // this.itemResult.text = formData.text;
    return this.itemResult.update(formData)
  }

  // TODO: The save button doesn't work, but closing the window runs _updateObject
  //       Check roll-table-config.js line 307 for how foundry itself does it

  get title(): string {
    return this.windowTitle;
  }

  constructor(result: LocalTableResult, windowTitle: string) {
    super(result);
    this.itemResult = result;
    this.windowTitle = windowTitle;
    loadTemplates([MODULE.templatePath]).then(() => {
      
    });
    return this;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
  }

  /* -------------------------------------------- */
  /* Returns the data which will be available
   * to the template
  */
  async getData(options?: Partial<FormApplicationOptions> | undefined): Promise<GetDataReturnType<FormApplication.FormApplicationData<FormApplicationOptions, unknown>>> {
    let superContext = super.getData(options);
    // let textHTML = await TextEditor.enrichHTML(this.itemResult.text, {secrets: this.itemResult.isOwner});
    log("parent info in getData");
    log(this.itemResult);
    let instanceContext = {
      title: this.windowTitle,
      // result: Handlebars.escapeExpression(this.itemResult.text),
      result: this.itemResult,
      resultText: this.itemResult.text,
      itemLabel: this.itemResult.rangeText,
    };
    let result = foundry.utils.mergeObject(superContext, instanceContext);
    return result;
    }

  static get defaultOptions() {
    let defaults = super.defaultOptions;
    let local = {
      id: "htmlInputTemplate",
      template: MODULE.templatePath,
      closeOnSubmit: true,
      submitOnClose: true,
      width: 500,
      height: 300,
    };
    return foundry.utils.mergeObject(defaults, local);
  }
}


Hooks.on("renderRollTableConfig", mutateTextInputs);
