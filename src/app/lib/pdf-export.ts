import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Match, MatchPlayer, Player, MatchHistory } from './types';

interface MatchHistoryRow {
  date: string;
  players: string;
  type: string;
  scores: string;
  winner: string;
}

export async function exportMatchHistoryToPDF() {
  try {
    // Fetch match history data
    const response = await fetch('/api/match-history');
    const data: MatchHistory = await response.json();
    
    if (!data || !data.matchHistory || !Array.isArray(data.matchHistory)) {
      throw new Error('Invalid match history data received');
    }

    const matches: Match[] = data.matchHistory;

    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Match History Report', 14, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData: MatchHistoryRow[] = matches.map(match => ({
      date: new Date().toLocaleDateString(), // Using current date since Match type doesn't have date
      players: match.matchPlayers.map((mp: MatchPlayer) => mp.player.name).join(' vs '),
      type: match.matchType,
      scores: match.matchPlayers.map((mp: MatchPlayer) => `${mp.player.name}: ${mp.score}`).join(', '),
      winner: match.winner?.player.name || 'Draw'
    }));

    // Add table
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Players', 'Type', 'Scores', 'Winner']],
      body: tableData.map(row => [
        row.date,
        row.players,
        row.type,
        row.scores,
        row.winner
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 }
      }
    });

    // Save the PDF
    doc.save('match-history.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
} 