import {
  getInvoiceDiscount,
  getInvoiceItems,
  getInvoiceSubtotal,
  getInvoiceTax,
  getInvoiceTaxOption,
  getInvoiceTotal,
  getLineAmount,
  terbilang,
  type InvoiceFormValues,
} from './invoice-form-data'

export function InvPaper({ invoice }: { invoice: InvoiceFormValues }) {
  const items = getInvoiceItems(invoice)
  const subtotal = getInvoiceSubtotal(invoice)
  const discount = getInvoiceDiscount(invoice)
  const tax = getInvoiceTax(invoice)
  const grandTotal = getInvoiceTotal(invoice)
  const taxOption = getInvoiceTaxOption(invoice)
  
  const formatRupiah = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID')
  }

  // Calculate dynamic spacer height to fill exactly 100px minus item rows
  const spacerHeight = Math.max(100 - items.length * 28, 15) + 'px'

  // Dynamic QR Code link generated from Reference Number
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoice.referenceNumber || 'INV-0000')}`

  return (
    <article
      data-print-paper
      className='relative bg-white text-black font-sans select-text border border-black shadow-md'
      style={{
        width: '210mm',
        height: '297mm',
        padding: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Scope Style Block to keep tables bordered exactly like traditional invoices */}
      <style dangerouslySetInnerHTML={{ __html: `
        .inv-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .inv-table td, .inv-table th { border: 1px solid #000; padding: 5px; font-size: 11px; vertical-align: top; font-family: Arial, sans-serif; color: #000; }
        .inv-header { text-align: center; }
        .inv-header h2 { font-size: 20px; font-weight: bold; margin-bottom: 2px; }
        .inv-table td.inv-title { font-family: Arial, sans-serif !important; font-size: 22px !important; font-weight: bold; text-align: center; padding: 10px; background-color: #f3f4f6; }
        .inv-text-center { text-align: center; }
        .inv-text-right { text-align: right; }
        .inv-no-border { border: none !important; }
        .inv-signature { height: 90px; position: relative; text-align: center; }
        .inv-signature span { display: block; font-weight: bold; font-size: 11px; margin-top: 2px; }
        .inv-logo-box { width: 85px; height: 85px; border: 1px solid #000; margin: auto; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; background-color: #f9fafb; overflow: hidden; }
        .inv-qr { width: 85px; height: 85px; border: 1px solid #000; margin: auto; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; overflow: hidden; }
        .inv-qr-qris { width: 85px; height: 85px; border: 1px solid #000; margin: auto; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; background-color: #f9fafb; }
        .inv-stamp-img { display: block; margin: 0 auto; width: 130px; height: 60px; object-fit: contain; opacity: 0.9; pointer-events: none; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          /* Hide all page components, sidebar, header, form edit section, print buttons, and TanStack Router banner */
          header, nav, aside, button, [data-slot="sheet"], #root > div > div:first-child, .__react-router-devtools, .no-print {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Reset parent transform stack contexts so the fixed paper can print unscaled */
          .print-paper-wrapper-parent {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            width: auto !important;
            height: auto !important;
            opacity: 1 !important;
          }
          
          .print-paper-wrapper {
            transform: none !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
          
          /* Enforce background colors to show when printing */
          body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Force the specific invoice sheet to fit printable area inside margins */
          [data-print-paper] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 190mm !important;
            height: 272mm !important;
            border: 1px solid #000 !important;
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 99999 !important;
            background: #ffffff !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            box-sizing: border-box !important;
          }
        }
      `}} />

      <div className='flex flex-col h-full justify-between p-1'>
        <div className='space-y-0.5'>
          {/* Header Row */}
          <table className='inv-table'>
            <tbody>
              <tr>
                <td width="15%" className="inv-text-center py-2" style={{ verticalAlign: 'middle' }}>
                  <div className="inv-logo-box">
                    {invoice.logoUrl ? (
                      <img src={invoice.logoUrl} alt="Logo" className="size-full object-contain" />
                    ) : (
                      'LOGO'
                    )}
                  </div>
                </td>
                <td width="65%" className="inv-header">
                  <h2>PT REXINDO ARUNA SEDAYA</h2>
                  <div className='text-xs'>Company Address<br />Jakarta, Indonesia</div>
                  <table className='inv-table mt-1'>
                    <tbody>
                      <tr>
                        <td className="inv-no-border py-0.5"><b>NPWP</b></td>
                        <td className="inv-no-border py-0.5">: 01.234.567.8-901.000</td>
                        <td className="inv-no-border py-0.5"><b>NIB</b></td>
                        <td className="inv-no-border py-0.5">: -</td>
                      </tr>
                      <tr>
                        <td className="inv-no-border py-0.5"><b>Email</b></td>
                        <td className="inv-no-border py-0.5">: info@rexindo.com</td>
                        <td className="inv-no-border py-0.5"><b>Phone</b></td>
                        <td className="inv-no-border py-0.5">: +62-21-5555-0184</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="20%" className="inv-text-center py-2" style={{ verticalAlign: 'middle' }}>
                  <div className="inv-qr">
                    <img src={qrUrl} alt="Invoice QR" className="size-full object-contain" />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="inv-title">INVOICE</td>
              </tr>
            </tbody>
          </table>

          {/* Client & Metadata Row */}
          <table className='inv-table'>
            <tbody>
              <tr>
                <td width="33%">
                  <b>Billed To</b>
                  <hr className='my-1 border-black' />
                  <span className='font-bold'>{invoice.to.name}</span>
                  <br />
                  <span className='text-[10px] text-stone-700'>{invoice.to.addressLines.join(', ')}</span>
                  {invoice.to.taxId && <div className='mt-1 text-[10px]'>Tax ID: {invoice.to.taxId}</div>}
                </td>
                <td width="33%">
                  <b>Ship To</b>
                  <hr className='my-1 border-black' />
                  <span className='text-[10px] text-stone-700'>{invoice.shipTo || '-'}</span>
                </td>
                <td width="34%" className='p-0'>
                  <table className='inv-table' style={{ border: 'none' }}>
                    <tbody>
                      <tr>
                        <td className='inv-no-border py-1'>Invoice No</td>
                        <td className='inv-no-border py-1 font-mono font-bold'>{invoice.referenceNumber}</td>
                      </tr>
                      <tr>
                        <td className='inv-no-border py-1'>Date</td>
                        <td className='inv-no-border py-1'>{invoice.issuedDate}</td>
                      </tr>
                      <tr>
                        <td className='inv-no-border py-1'>Due Date</td>
                        <td className='inv-no-border py-1'>{invoice.paymentDueDate}</td>
                      </tr>
                      <tr>
                        <td className='inv-no-border py-1'>PO</td>
                        <td className='inv-no-border py-1'>{invoice.poNumber || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Line Items Table */}
          <table className='inv-table'>
            <thead>
              <tr className='bg-stone-50'>
                <th style={{ width: '5%' }} className='inv-text-center'>No</th>
                <th style={{ width: '45%' }}>Description</th>
                <th style={{ width: '10%' }} className='inv-text-center'>Qty</th>
                <th style={{ width: '8%' }} className='inv-text-center'>Unit</th>
                <th style={{ width: '12%' }} className='inv-text-right'>Price</th>
                <th style={{ width: '8%' }} className='inv-text-center'>Disc</th>
                <th style={{ width: '8%' }} className='inv-text-center'>VAT</th>
                <th style={{ width: '14%' }} className='inv-text-right'>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const lineTotal = getLineAmount(item)
                return (
                  <tr key={item.id}>
                    <td className='inv-text-center'>{idx + 1}</td>
                    <td>{item.description}</td>
                    <td className='inv-text-center'>{item.quantity}</td>
                    <td className='inv-text-center'>PCS</td>
                    <td className='inv-text-right'>{formatRupiah(item.unitPrice)}</td>
                    <td className='inv-text-center'>0%</td>
                    <td className='inv-text-center'>{taxOption.rate}%</td>
                    <td className='inv-text-right'>{formatRupiah(lineTotal)}</td>
                  </tr>
                )
              })}
              {/* Vertical Spacer Row to enforce 250px A4 proportion height */}
              <tr>
                <td colSpan={8} style={{ height: spacerHeight }} className='bg-white'></td>
              </tr>
            </tbody>
          </table>

          {/* Financial Summary */}
          <table className='inv-table'>
            <tbody>
              <tr>
                <td width="65%" rowSpan={4}>
                  <div className='font-bold mb-1'>Amount in Words</div>
                  <div className='italic bg-stone-50 p-2 border border-stone-200 rounded-sm text-xs text-stone-800 font-bold uppercase'>
                    # {terbilang(grandTotal)} #
                  </div>
                </td>
                <td width="15%">Subtotal</td>
                <td width="20%" className="inv-text-right">{formatRupiah(subtotal)}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td className="inv-text-right">{formatRupiah(discount)}</td>
              </tr>
              <tr>
                <td>VAT ({taxOption.rate}%)</td>
                <td className="inv-text-right">{formatRupiah(tax)}</td>
              </tr>
              <tr className='bg-stone-50 font-bold'>
                <td>Grand Total</td>
                <td className="inv-text-right text-lg border-double border-b-4 border-black">{formatRupiah(grandTotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Terms, Bank, QRIS, Signature */}
          <table className='inv-table'>
            <tbody>
              <tr>
                <td width="50%">
                  <b>Terms & Conditions</b>
                  <div className='text-[10px] mt-2 space-y-0.5 text-stone-600 leading-normal'>
                    1. Payment must be made according to this invoice number.<br />
                    2. Goods sold are non-refundable.<br />
                    3. Please send payment confirmation to the finance department.
                  </div>
                </td>
                <td width="25%">
                  <b>Bank Account Details</b>
                  <div className='text-[10px] mt-2 text-stone-700 leading-relaxed'>
                    Bank: {invoice.bankName || '-'}<br />
                    Acc: {invoice.bankAccount || '-'}<br />
                    A/N: {invoice.bankAccountName || '-'}
                  </div>
                </td>
                <td width="25%" className="inv-text-center py-2" style={{ verticalAlign: 'middle' }}>
                  <div className="inv-qr-qris">QRIS</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <b>Notes</b>
                  <div className='text-[10px] text-stone-700 mt-0.5 min-h-[20px]'>
                    {invoice.notes || '-'}
                  </div>
                </td>
                <td className="inv-signature" style={{ verticalAlign: 'middle', padding: '4px 5px' }}>
                  <div className='flex flex-col items-center justify-center h-full relative' style={{ minHeight: '74px' }}>
                    {invoice.stampUrl ? (
                      <img src={invoice.stampUrl} alt="Company Stamp" className="inv-stamp-img" />
                    ) : (
                      <div className='h-[60px]' />
                    )}
                    <span>Authorized Signature</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Centered Invoice Footer Info */}
        <div className='text-center text-[10px] text-stone-600 space-y-1 py-1 mt-1 border-t border-stone-200'>
          <p className='leading-normal'>
            If you have any questions about this invoice, please contact
            <br />
            <strong>{invoice.from.name || 'PT Rexindo Aruna Sedaya'}</strong>, phone: <strong>{invoice.from.phone || '+62 85723000060'}</strong>, email: <strong>{invoice.from.email || 'support@rexcorp.id'}</strong>
          </p>
          <p className='text-xs font-bold text-stone-800 tracking-wide mt-0.5'>
            Thank You For Your Business!
          </p>
        </div>
      </div>
    </article>
  )
}
