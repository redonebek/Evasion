import { jsPDF } from "jspdf";
import { Itinerary } from "../types";

export const exportToPdf = (itinerary: Itinerary) => {
  // Create document
  const doc = new jsPDF();
  
  // Settings
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;

  // Helper to check page break
  const checkPageBreak = (height: number) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(itinerary.tripTitle, pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Voyage à ${itinerary.destination}`, pageWidth / 2, y, { align: "center" });
  y += 15;

  // --- Summary ---
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(60);
  const summaryLines = doc.splitTextToSize(itinerary.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 10;

  // --- Separator ---
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- Daily Plans ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Itinéraire Détaillé", margin, y);
  y += 10;

  itinerary.dailyPlans.forEach((plan) => {
    checkPageBreak(30);
    
    // Day Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text(`Jour ${plan.day}: ${plan.theme}`, margin, y);
    y += 7;

    // Activities
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    plan.activities.forEach((activity) => {
      const bullet = `• ${activity.time}: ${activity.description}`;
      const lines = doc.splitTextToSize(bullet, contentWidth - 5);
      
      checkPageBreak(lines.length * 5);
      
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 2;
    });
    
    y += 5; // Spacing between days
  });

  y += 5;
  checkPageBreak(20);
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- Practical Info ---
  checkPageBreak(60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Infos Pratiques & Budget", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const dishesString = itinerary.practicalInfo.localDishes.join(', ');
  
  const infos = [
    `Budget estimé: ${itinerary.practicalInfo.budgetEstimate}`,
    `Devise: ${itinerary.practicalInfo.currency}`,
    `Spécialités culinaires: ${dishesString}`,
    `Météo: ${itinerary.practicalInfo.weatherTip}`
  ];

  infos.forEach(info => {
    const lines = doc.splitTextToSize(`• ${info}`, contentWidth - 5);
    checkPageBreak(lines.length * 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });
  
  y += 10;

  // --- Packing List ---
  checkPageBreak(60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Dans la valise", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  itinerary.packingList.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
    checkPageBreak(lines.length * 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });

  y += 8;

  // --- Local Tips ---
  checkPageBreak(60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Conseils Locaux", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  itinerary.localTips.forEach(tip => {
    const lines = doc.splitTextToSize(`• ${tip}`, contentWidth - 5);
    checkPageBreak(lines.length * 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });

  // --- Footer ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Généré par Évasion - Page ${i} sur ${totalPages}`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: "center" }
    );
  }

  // Save
  doc.save(`Evasion_${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};