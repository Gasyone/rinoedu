$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server started at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop..."

Start-Process "http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Correct path formatting
        $localFilePath = $PWD.Path + $request.Url.LocalPath.Replace('/', '\')
        if ($localFilePath -match "\\$") {
            $localFilePath += "index.html"
        }

        if (Test-Path $localFilePath -PathType Leaf) {
            try {
                $content = [System.IO.File]::ReadAllBytes($localFilePath)
                $response.ContentLength64 = $content.Length
                
                $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
                if ($ext -eq ".html") { $response.ContentType = "text/html; charset=utf-8" }
                elseif ($ext -eq ".css") { $response.ContentType = "text/css" }
                elseif ($ext -eq ".js" -or $ext -eq ".jsx") { $response.ContentType = "application/javascript; charset=utf-8" }
                elseif ($ext -eq ".json") { $response.ContentType = "application/json" }
                else { $response.ContentType = "application/octet-stream" }

                $output = $response.OutputStream
                $output.Write($content, 0, $content.Length)
                $output.Close()
            } catch {
                $response.StatusCode = 500
                $response.Close()
            }
        } else {
            $response.StatusCode = 404
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
