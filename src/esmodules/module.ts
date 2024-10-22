import { GetDataReturnType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";

const MODULE_ID = 'format-rolltable-text';

export const MODULE = {
  ns: MODULE_ID,
  path: `modules/${MODULE_ID}`,
  templatePath: `modules/${MODULE_ID}/templates/htmlInputTemplate.hbs`,
};

const log = (...args: any): void => {
  try {
    const dev_mode = game.modules?.get('_dev-mode');
    const isDebugging = false; // api['getPackageDebugValue'](MODULE_ID);

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
}

var mutateTextInputs = async(rollTableData: RollTableConfig, html: JQuery, rollTable: RollTable) => {
  if (rollTableData.isEditable === false) {
    // This table isn't editable
    return;
  }

  const tableName = rollTableData.object.name;
  const results = rollTableData.object.results;

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

  textResults.forEach((result: LocalTableResult) => {
    let allResultRows = html.find('tr.table-result:not(.table-header)');
    let textResultRows = allResultRows.filter(':has(.result-type option:checked[value="text"])');
    
    let resultRow = textResultRows.eq(result.index);
    let resultCell = resultRow.find(`td.result-details`);

    let resultTextInput = resultCell?.find(`input[type=text]`) as JQuery<HTMLInputElement>;
    resultTextInput.addClass("str-shorter-table-input")
    resultTextInput.length -= 1;

    let button = document.createElement('button') as HTMLButtonElement;
    button.type = "button";
    button.innerHTML = "<i class='fas fa-edit' title='Edit'></i>";
    button.onclick = () => new RollTableTextHelper(result, tableName, resultTextInput).render(true);
    button.style.width = "2em";
    button.style.padding = "0 0 0 0";

    resultCell.append(button);
  })
  };  

interface FormData {
  text: string;
}

export class RollTableTextHelper extends FormApplication {
  itemResult: LocalTableResult;
  windowTitle: string;
  originalElement: JQuery<HTMLInputElement>;

  /**
   * 
   * @param event 
   * @param formData 
   * @returns an empty promise
   * 
   * Called when the editing popup window is closed
   * Updates the original input element with the new text
   */
  protected _updateObject(event: Event, formData: FormData): Promise<unknown> {
    this.originalElement.val(formData.text);
    this.itemResult.text = formData.text;
    return this.itemResult.update({text: formData.text});
  }

  get title(): string {
    return this.windowTitle;
  }

  constructor(result: LocalTableResult, windowTitle: string, inputElement: JQuery<HTMLInputElement>) {
    super(result);
    this.itemResult = result;
    this.windowTitle = windowTitle;
    this.originalElement = inputElement;
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
    let instanceContext = {
      title: this.windowTitle,
      result: this.itemResult,
      range: `${this.itemResult.range[0]}-${this.itemResult.range[1]}`
    };
    let result = foundry.utils.mergeObject(superContext, instanceContext);
    return result;
    }

  static get defaultOptions() {
    let defaults = super.defaultOptions;
    let local = {
      classes: ["roll-table-config", "format-rolltable-text"],
      template: MODULE.templatePath,
      closeOnSubmit: true,
      submitOnClose: true,
      popOut: true,
      resizable: true,
      // width: 'auto',
      height: 'auto',
      // viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
    };
    return foundry.utils.mergeObject(defaults, local);
  }
}


Hooks.on("renderRollTableConfig", mutateTextInputs);
