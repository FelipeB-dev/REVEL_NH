// Este código va en Google Apps Script (Extensiones → Apps Script)
// NO es un archivo del proyecto web

var SHEET_ID = '1FhLZlKnRtEcNqO--8MdDHbw1GGnvEgAZjBBJKb0011w';

function doGet(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var type = e.parameter.type;

  if (type === 'rsvp') {
    var rsvpSheet = sheet.getSheetByName('RSVP');
    rsvpSheet.appendRow([new Date(), e.parameter.name]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (type === 'vote') {
    var votesSheet = sheet.getSheetByName('Votos');
    votesSheet.appendRow([e.parameter.choice, new Date()]);
    var votesData = votesSheet.getDataRange().getValues();
    var girl = 0;
    var boy = 0;
    for (var i = 1; i < votesData.length; i++) {
      if (votesData[i][0] === 'girl') girl++;
      if (votesData[i][0] === 'boy') boy++;
    }
    return ContentService.createTextOutput(JSON.stringify({
      girl: girl, boy: boy, total: girl + boy
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (type === 'getVotes') {
    var votesSheet = sheet.getSheetByName('Votos');
    var votesData = votesSheet.getDataRange().getValues();
    var girl = 0;
    var boy = 0;
    for (var i = 1; i < votesData.length; i++) {
      if (votesData[i][0] === 'girl') girl++;
      if (votesData[i][0] === 'boy') boy++;
    }
    return ContentService.createTextOutput(JSON.stringify({
      girl: girl, boy: boy, total: girl + boy
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'error' }))
    .setMimeType(ContentService.MimeType.JSON);
}
