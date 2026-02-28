<?php
/**
 * Balancewise Technologies — Application Form Handler
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://balancewises.io');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

$name    = htmlspecialchars(trim($body['fullname'] ?? ''));
$email   = filter_var(trim($body['email']    ?? ''), FILTER_VALIDATE_EMAIL);
$role    = htmlspecialchars(trim($body['role']     ?? 'Not specified'));
$github  = htmlspecialchars(trim($body['github']   ?? 'Not provided'));
$linkedin= htmlspecialchars(trim($body['linkedin'] ?? 'Not provided'));
$message = htmlspecialchars(trim($body['message']  ?? ''));

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Required fields are missing.']);
    exit;
}

$to      = 'info@balancewises.io';
$subject = "New Application: {$role} — {$name}";

$html_body = "
<html><body style='font-family:sans-serif;max-width:600px;margin:0 auto'>
  <h2 style='color:#081336'>New Job Application</h2>
  <table cellpadding='8' style='border-collapse:collapse;width:100%'>
    <tr><td style='font-weight:700;color:#475569;width:120px'>Name</td><td>{$name}</td></tr>
    <tr><td style='font-weight:700;color:#475569'>Email</td><td><a href='mailto:{$email}'>{$email}</a></td></tr>
    <tr><td style='font-weight:700;color:#475569'>Role</td><td>{$role}</td></tr>
    <tr><td style='font-weight:700;color:#475569'>GitHub</td><td>{$github}</td></tr>
    <tr><td style='font-weight:700;color:#475569'>LinkedIn</td><td>{$linkedin}</td></tr>
    <tr><td style='font-weight:700;color:#475569;vertical-align:top'>Message</td><td>{$message}</td></tr>
  </table>
  <p style='color:#94a3b8;font-size:12px;margin-top:24px'>Sent via balancewises.io application form</p>
</body></html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@balancewises.io\r\n";
$headers .= "Reply-To: {$email}\r\n";

$sent = mail($to, $subject, $html_body, $headers);

echo json_encode(['success' => true, 'sent' => $sent]);
