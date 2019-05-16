module.exports = (head, body, tail)=>{
return `<!DOCTYPE html>
<!-- Doctype HTML5 -->
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1'>

		${head}
	</head>
	<body>${body}</body>
	${tail}
</html>`
}
