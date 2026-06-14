$result = Test-NetConnection -ComputerName localhost -Port 3003 -WarningAction SilentlyContinue
"Port 3003 open: $($result.TcpTestSucceeded)" | Out-File "C:\MissionControl\LionRMS-Website\port-check.txt"
$result2 = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
"Port 3000 open: $($result2.TcpTestSucceeded)" | Out-File -Append "C:\MissionControl\LionRMS-Website\port-check.txt"
netstat -ano | findstr ":300" | Out-File -Append "C:\MissionControl\LionRMS-Website\port-check.txt"
