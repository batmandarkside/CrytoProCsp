import React from 'react';
import { InstructionInstallText } from './instruction-install-text';


/**
 * инструкция по установки плагина
 * @constructor
 */
export const InstructionInstall = () => (
  <div className="b-sign-component-instructions">
    <div className="b-sign__title">Установка криптоплагина</div>
    <div className="modal-signing-body">
      <InstructionInstallText />
    </div>
  </div>
);
