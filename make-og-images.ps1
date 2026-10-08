Add-Type -AssemblyName System.Drawing

function CreateSquareOgJpeg([string]$srcPath, [string]$destPath, [int]$cropMode = 0) {
    if (-not (Test-Path $srcPath)) {
        Write-Host "Source $srcPath not found"
        return
    }
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath).Path)
    $targetSize = 800
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $w = $img.Width
    $h = $img.Height

    $srcW = $w
    $srcH = $h
    $srcX = 0
    $srcY = 0

    if ($w -gt $h) {
        $srcW = $h
        $srcX = [int](($w - $h) / 2)
    } elseif ($h -gt $w) {
        $srcH = $w
        if ($cropMode -eq 1) {
            # Top-aligned crop (for portraits)
            $srcY = [int]($h * 0.05)
            if ($srcY + $srcH -gt $h) { $srcY = $h - $srcH }
        } else {
            $srcY = [int](($h - $w) / 2)
        }
    }

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcW, $srcH)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()
    $img.Dispose()

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]80)

    if (Test-Path $destPath) { Remove-Item $destPath -Force }
    $bmp.Save($destPath, $codec, $encoderParams)
    $bmp.Dispose()

    $len = (Get-Item $destPath).Length
    $kb = [math]::Round($len / 1024, 1)
    Write-Host "Created: $destPath ($kb KB)"
}

CreateSquareOgJpeg "public/assets/img/felipe-portrait.jpg" "public/assets/img/og-personal.jpg" 1
CreateSquareOgJpeg "public/assets/img/tenis-jogadora-saque.png" "public/assets/img/og-saque.jpg" 0
CreateSquareOgJpeg "public/assets/img/tenis-raquete-saibro.png" "public/assets/img/og-saibro.jpg" 0
CreateSquareOgJpeg "public/assets/img/treino-forca-remada.png" "public/assets/img/og-remada.jpg" 0
CreateSquareOgJpeg "public/assets/img/banner-beach-tennis.jpg" "public/assets/img/og-beach.jpg" 0
CreateSquareOgJpeg "public/assets/img/banner-tenis.jpg" "public/assets/img/og-default.jpg" 0
