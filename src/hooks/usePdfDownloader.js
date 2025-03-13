import { useRef, useState } from "react";

const PDF_OPTIONS = {
  margin: [0, 0, 0, 0],
  image: { type: "jpeg", quality: 0.7 },
  html2canvas: { scale: 2, useCORS: true, letterRendering: true },
  jsPDF: {
    unit: "pt",
    format: "a4",
    orientation: "portrait",
    enableLinks: true,
    putOnlyUsedFonts: true,
    floatPrecision: 16,
    fontEmbedding: true,
  },
};

const usePdf = (props) => {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const pdfRef = useRef();

  // Function to generate the PDF
  const generatePdf = async () => {
    const html2pdf = require("html2pdf.js");

    if (!pdfRef?.current) return;

    const element = pdfRef.current;
    const pdfOptions = {
      ...PDF_OPTIONS,
      ...props?.options,
    };

    const pdfDataUri = await html2pdf()
      .from(element)
      .set(pdfOptions)
      .toPdf()
      .get("pdf");

    // FOOTER - Except the last page
    if (props?.footerContent) {
      const pageCount = pdfDataUri.internal.getNumberOfPages();
      const pageWidth = pdfDataUri.internal.pageSize.getWidth();
      const pageHeight = pdfDataUri.internal.pageSize.getHeight();

      for (let i = 1; i <= pageCount - 1; i++) {
        pdfDataUri.setPage(i);
        pdfDataUri.setFontSize(6.75);
        pdfDataUri.setTextColor(128);
        pdfDataUri.text(props.footerContent, pageWidth / 2, pageHeight - 20, {
          align: "center",
        });
      }
    }

    return pdfDataUri;
  };

  // Function to download PDF
  const downloadPdf = async (pdfName = "document") => {
    setIsPdfGenerating(true);
    try {
      const pdfDataUri = await generatePdf();
      pdfDataUri.save(pdfName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Function to get Base64 PDF
  const base64Pdf = async () => {
    setIsPdfGenerating(true);
    try {
      const pdfDataUri = await generatePdf();
      const pdfBlob = await pdfDataUri.output("blob");

      // Convert the Blob object to Base64
      const pdfBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove Data URI prefix
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      return pdfBase64;
    } catch (error) {
      console.error("Error generating Base64 PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return {
    pdfRef,
    isPdfGenerating,
    downloadPdf,
    base64Pdf,
  };
};

export default usePdf;

// NOTE: Tested Package Versions
// "html2canvas": "^1.0.0-alpha.12",
// "html2pdf.js": "^0.9.3",

// NOTE: Add these css to global.css
// .break-avoid {
//   page-break-inside: avoid; /* For Chrome, Safari */
//   break-inside: avoid; /* For Firefox */
//   overflow: hidden; /* Fallback for some cases */
// }
// .page-break {
//   page-break-before: always; /* For Chrome, Safari */
//   break-before: always; /* For Firefox */
// }
// .printable-content {
//     /* Default styles */
//   }
//   @media print {
//     .printable-content {
//       margin: auto;
//     }
//   }
