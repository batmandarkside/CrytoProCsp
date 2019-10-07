import React from 'react';
import Icon  from 'components/ui-components/icon';
import {
  InstructionInstall
} from './style.js';


/**
 * инструкция по установки плагина
 * @constructor
 */
export const InstructionInstallText = () => (
  <InstructionInstall>
    <div><strong>Для подписи документов электронным ключом необходимо установить криптоплагин.</strong></div>
    <p>Загрузите и установите плагин. После этого перезапустите браузер и повторите подпись документа.</p>
    <div className="modal-signing-link">
      <a href="https://www.cryptopro.ru/products/cades/plugin/get_2_0" title="Загрузить плагин">
        <Icon type="download" size="16" />
        Загрузить плагин
      </a>
    </div>
    <div className="modal-signing-link">
      <a
        href="http://www.raiffeisen.ru/business/dist/rbo_plugin/"
        title="Инструкция по установке"
        target="_bank"
      >
        <Icon type="download" size="16" />
        Инструкция по установке
      </a>
    </div>
  </InstructionInstall>
);
