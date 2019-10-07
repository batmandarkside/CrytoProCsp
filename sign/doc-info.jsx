import React      from 'react';
import PropTypes  from 'prop-types';
import moment     from 'moment-timezone';
import { getFormattedAccNum, filterPlural } from 'utils';
import { customizableFormatter } from 'utils/number-formatter';

const formatter = customizableFormatter();

const DocInfo = (props) => {
  const { documents } = props;
  const doc = documents.first();

  if (documents.size > 1) {
    const quantity = documents.size;
    const quantityText = filterPlural(['документ', 'документа', 'документов'], quantity);
    return (
      <div className="b-sign__summary">
        <div>`{quantity} {quantityText} на подпись`</div>
      </div>
    );
  }
  const docType = doc.get('docType');
  const docNumber = doc.get('docNumber');
  const docDate = moment(doc.get('docDate')).format('DD.MM.YYYY');
  const docSum = doc.get('docSum');
  const docCurrency = doc.get('docCurr');
  const payerAccount = doc.get('payerAccount');
  const receiverAccount = doc.get('receiverAccount');

  return (
    <div className="b-sign__summary">
      <div>{docType} №{docNumber} от {docDate}</div>

      { docSum && (
        <div className="b-sign__summary-row">
          <div className="b-sign__summary-row-name">Сумма</div>
          <div>{formatter(docSum)} {docCurrency}</div>
        </div>
      )}

      {payerAccount && (
        <div className="b-sign__summary-row">
          <div className="b-sign__summary-row-name">Со счета</div>
          <div>{getFormattedAccNum(payerAccount)}</div>
        </div>
      )}
      {receiverAccount && (
        <div className="b-sign__summary-row">
          <div className="b-sign__summary-row-name">На счет</div>
          <div>{getFormattedAccNum(receiverAccount)}</div>
        </div>
      )}
    </div>
  );
};

DocInfo.propTypes = {
  documents: PropTypes.object.isRequired,
};

export default DocInfo;
