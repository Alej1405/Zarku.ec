<?php
/**
 * OG dinámico por noticia para zarku.ec (SPA sobre LiteSpeed).
 *
 * Enrutado desde .htaccess:  /noticias/{slug}  ->  og.php?slug={slug}
 * Consulta la nota en el CMS, inyecta las metaetiquetas Open Graph / Twitter
 * en index.html y lo sirve. La SPA de React se hidrata igual; la diferencia es
 * que los scrapers (WhatsApp, Facebook, X, Telegram) —que NO ejecutan JS— ya
 * reciben el título, la descripción y la imagen reales de cada noticia.
 */

$slug = isset($_GET['slug']) ? preg_replace('/[^a-z0-9\-]/i', '', $_GET['slug']) : '';

$CMS   = 'https://erp.mashaec.net/api/cms/zarku-ecuador';
$TOKEN = '12|kPVaj7sNxO0eyH1DSmPXD5eL0Ufnxn0yvGnAsMH707afbd32';
$SITE  = 'https://zarku.ec';

// Valores por defecto (por si la nota no existe / falla la API).
$title = 'Noticias · Zarku';
$desc  = 'Novedades y notas de Zarku, marca ecuatoriana de accesorios técnicos de aventura.';
$image = $SITE . '/brand/og-catalogo.jpg';
$url   = $SITE . '/noticias/' . $slug;

if ($slug !== '' && function_exists('curl_init')) {
    $ch = curl_init("$CMS/posts/$slug");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $TOKEN", 'Accept: application/json'],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200 && $body) {
        $post = json_decode($body, true);
        if (is_array($post) && !empty($post['titulo'])) {
            $title = $post['titulo'] . ' — Zarku';
            if (!empty($post['imagen'])) {
                $image = $post['imagen'];
            }
            $raw  = isset($post['contenido']) ? $post['contenido'] : '';
            $text = trim(preg_replace('/\s+/', ' ', strip_tags($raw)));
            if ($text === '') {
                $text = $post['titulo'];
            }
            $desc = mb_substr($text, 0, 200);
            if (mb_strlen($text) > 200) {
                $desc .= '…';
            }
        }
    }
}

// Plantilla base = el index.html del build (mismo directorio).
$html = @file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    http_response_code(500);
    exit('index.html no encontrado');
}

// Quita las metaetiquetas por defecto para no duplicarlas.
$html = preg_replace('/<title>.*?<\/title>/is', '', $html, 1);
$html = preg_replace('/<meta[^>]+property="og:[^"]*"[^>]*>/i', '', $html);
$html = preg_replace('/<meta[^>]+name="twitter:[^"]*"[^>]*>/i', '', $html);
$html = preg_replace('/<meta[^>]+name="description"[^>]*>/i', '', $html);
$html = preg_replace('/<link[^>]+rel="canonical"[^>]*>/i', '', $html);

function esc($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

$tags  = "\n";
$tags .= '<title>' . esc($title) . "</title>\n";
$tags .= '<link rel="canonical" href="' . esc($url) . "\" />\n";
$tags .= '<meta name="description" content="' . esc($desc) . "\" />\n";
$tags .= '<meta property="og:type" content="article" />' . "\n";
$tags .= '<meta property="og:site_name" content="Zarku" />' . "\n";
$tags .= '<meta property="og:url" content="' . esc($url) . "\" />\n";
$tags .= '<meta property="og:title" content="' . esc($title) . "\" />\n";
$tags .= '<meta property="og:description" content="' . esc($desc) . "\" />\n";
$tags .= '<meta property="og:image" content="' . esc($image) . "\" />\n";
$tags .= '<meta property="og:locale" content="es_EC" />' . "\n";
$tags .= '<meta name="twitter:card" content="summary_large_image" />' . "\n";
$tags .= '<meta name="twitter:title" content="' . esc($title) . "\" />\n";
$tags .= '<meta name="twitter:description" content="' . esc($desc) . "\" />\n";
$tags .= '<meta name="twitter:image" content="' . esc($image) . "\" />\n";

$html = str_replace('</head>', $tags . '</head>', $html);

header('Content-Type: text/html; charset=UTF-8');
echo $html;
