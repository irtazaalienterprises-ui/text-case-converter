# Comprehensive Technical SEO & Google Indexing Audit
# Website: https://theconvertertool.com/
# Date: 2026-11-05

$ErrorActionPreference = "Continue"
$reportDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$htmlFiles = Get-ChildItem -Filter *.html | Sort-Object Name
$sitemapPath = "sitemap.xml"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "THE CONVERTER TOOL - COMPREHENSIVE SEO & INDEXING AUDIT" -ForegroundColor Cyan
Write-Host "Timestamp: $reportDate" -ForegroundColor Cyan
Write-Host "Repository: $PWD" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Sitemap Parsing
[xml]$sitemapXml = Get-Content $sitemapPath -Raw
$sitemapUrls = $sitemapXml.urlset.url.loc
Write-Host "`n[1] SITEMAP.XML AUDIT: Total URLs = $($sitemapUrls.Count)" -ForegroundColor Green

# 2. Page-by-Page Audit
$pageAudits = foreach ($f in $htmlFiles) {
    $c = Get-Content $f.Name -Raw

    $title = if ($c -match '<title>(.*?)</title>') { $matches[1].Trim() } else { "MISSING" }

    $desc = if ($c -match '<meta\s+name=["'']description["'']\s+content=["''](.*?)["'']') { $matches[1].Trim() }
            elseif ($c -match 'content=["''](.*?)["'']\s+name=["'']description["'']') { $matches[1].Trim() }
            else { "MISSING" }

    $canon = if ($c -match '<link\s+rel=["'']canonical["'']\s+href=["''](.*?)["'']') { $matches[1].Trim() } else { "MISSING" }

    $robots = if ($c -match '<meta\s+name=["'']robots["'']\s+content=["''](.*?)["'']') { $matches[1].Trim() } else { "none" }

    $h1Matches = [regex]::Matches($c, '<h1[^>]*>([\s\S]*?)</h1>')
    $h1Text = if ($h1Matches.Count -gt 0) { ($h1Matches[0].Groups[1].Value -replace '<[^>]+>', '').Trim() } else { "MISSING" }

    $hasGA4 = $c.Contains("G-SXGC2PG51C")
    $hasFavicon = $c.Contains("favicon.ico")
    $hasJsonLd = $c.Contains('application/ld+json')

    $expectedUrl = if ($f.Name -eq "index.html") { "https://theconvertertool.com/" } else { "https://theconvertertool.com/$($f.Name)" }
    $inSitemap = $sitemapUrls -contains $expectedUrl

    $issues = @()
    if ($title -eq "MISSING") { $issues += "Missing Title" }
    if ($desc -eq "MISSING") { $issues += "Missing Description" }
    if ($canon -eq "MISSING" -and $robots -ne "noindex, follow") { $issues += "Missing Canonical" }
    if ($h1Matches.Count -eq 0 -and $robots -ne "noindex, follow") { $issues += "Missing H1" }
    if ($h1Matches.Count -gt 1) { $issues += "Multiple H1s ($($h1Matches.Count))" }
    if (-not $hasGA4 -and $robots -ne "noindex, follow") { $issues += "Missing GA4" }
    if (-not $hasFavicon) { $issues += "Missing Favicon" }
    if ($canon -ne "MISSING" -and $canon -ne $expectedUrl -and $robots -ne "noindex, follow") { $issues += "Canonical Mismatch" }
    if ($robots -eq "index, follow" -and -not $inSitemap) { $issues += "Indexable Page Not In Sitemap" }
    if ($robots -eq "noindex, follow" -and $inSitemap) { $issues += "Noindexed Page In Sitemap" }

    [PSCustomObject]@{
        File = $f.Name
        Title = $title
        H1 = $h1Text
        H1Count = $h1Matches.Count
        Robots = $robots
        Canonical = $canon
        InSitemap = $inSitemap
        GA4 = $hasGA4
        Favicon = $hasFavicon
        JSONLD = $hasJsonLd
        Issues = if ($issues.Count -gt 0) { $issues -join "; " } else { "OK" }
    }
}

$pageAudits | Format-Table File, InSitemap, GA4, Favicon, JSONLD, Issues -AutoSize

# Export to CSV inside audit folder
$pageAudits | Export-Csv -Path "audit/page-audit-$((Get-Date).ToString('yyyyMMdd-HHmmss')).csv" -NoTypeInformation
Write-Host "`nDetailed report exported to audit/" -ForegroundColor Green
