!macro customUnInstall
  Delete /REBOOTOK "$APPDATA\Decisions\presets.json"
  RMDir /r /REBOOTOK "$APPDATA\Decisions"
!macroend
