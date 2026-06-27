"use client";

interface Props {
  phone: string | null;
  dealerName: string | null;
  vehicleName: string;
}

export default function DealerCTAButtons({ phone, dealerName, vehicleName }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm">
        📞 Call Dealer
      </a>
      <button
        type="button"
        onClick={() =>
          alert(
            `Test drive request for ${vehicleName} sent to ${dealerName || "dealer"}.\nOur team will contact you within 24 hours.`
          )
        }
        className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 py-2.5 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm">
        📅 Book Test Drive
      </button>
    </div>
  );
}
