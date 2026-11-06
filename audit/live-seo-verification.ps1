# Live SEO Verification Script for theconvertertool.com
# Tests live HTTP responses, canonical tags, title tags, sitemap, and redirects on Hostinger

$sitemapUrl = "https://theconvertertool.com/sitemap.xml"
Write-Host "Fetching live sitemap: $sitemapUrl" -ForegroundColor Cyan
[xml]$sitemapXml = (curl.exe -s $sitemapUrl)
$urls = $sitemapXml.urlset.url.loc
Write-Host "Total URLs in live sitemap: $($urls.Count)" -ForegroundColor Green

$results = foreach ($u in $urls) {
    # Fetch headers and content
    $headers = curl.exe -I -s $u
    $statusLine = ($headers -split "`r?`n")[0]
    $status = if ($statusLine -match '\s(\d{3})\s') { $matches[1] } else { "UNKNOWN" }
    
    $html = curl.exe -s $u
    $title = if ($html -match '<title>(.*?)</title>') { $matches[1].Trim() } else { "MISSING" }
    $canon = if ($html -match '<link\s+rel=["'']canonical["'']\s+href=["''](.*?)["'']') { $matches[1].Trim() } else { "MISSING" }
    $robots = if ($html -match '<meta\s+name=["'']robots["'']\s+content=["''](.*?)["'']') { $matches[1].Trim() } else { "none" }
    
    $canonMatch = ($canon -eq $u)
    
    [PSCustomObject]@{
        URL = $u
        HTTP = $status
        Title = $title
        Canonical = $canon
        CanonOK = $canonMatch
        Robots = $robots
    }
}

$results | Format-Table HTTP, CanonOK, Title, URL -AutoSize

# Export to CSV
$results | Export-Csv -Path "audit/live-verification-$((Get-Date).ToString('yyyyMMdd-HHmmss')).csv" -NoTypeInformation

# Test Redirects
Write-Host "`nTesting Critical Redirects:" -ForegroundColor Cyan
$redirectTests = @(
    "https://theconvertertool.com/text-to-binary-converter.html",
    "http://theconvertertool.com/",
    "https://www.theconvertertool.com/"
)
foreach ($r in $redirectTests) {
    $h = curl.exe -I -s $r
    $line1 = ($h -split "`r?`n")[0]
    $loc = ($h -split "`r?`n" | Where-Object { $_ -match '^location:\s*' })
    Write-Host "$r -> $line1 | $loc" -ForegroundColor Yellow
}
