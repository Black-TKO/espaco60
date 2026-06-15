export default function Step4({ receipt, receiptFileName, isImageFile, onReceiptChange, finalize, prevStep }) {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">Comprovante</h2>
        <p className="section__desc">Anexe o comprovante do pagamento PIX</p>
      </div>

      <label className={`upload${receipt ? ' upload--filled' : ''}`} htmlFor="receipt-file">
        {!receipt ? (
          <div className="upload__empty">
            <span className="upload__ico">📎</span>
            <p className="upload__text">Toque para selecionar o comprovante</p>
            <p className="upload__hint">JPG, PNG ou PDF aceitos</p>
          </div>
        ) : (
          <div className="upload__filled-inner">
            {isImageFile
              ? <img src={receipt} className="upload__preview-img" alt="Comprovante" />
              : (
                <div className="upload__pdf-preview">
                  <span className="upload__pdf-ico">📄</span>
                  <span className="upload__pdf-name">{receiptFileName}</span>
                </div>
              )
            }
            <span className="upload__change-hint">Toque para trocar</span>
          </div>
        )}
      </label>
      <input id="receipt-file" type="file" className="upload__input" accept="image/*,.pdf" onChange={onReceiptChange} />

      <div className="action-bar action-bar--split">
        <button className="btn btn--ghost" onClick={prevStep}>← Voltar</button>
        <button className="btn btn--success" disabled={!receipt} onClick={finalize}>
          🚀 Finalizar Agendamento
        </button>
      </div>
    </section>
  );
}
