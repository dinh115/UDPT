<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($data['title']); ?></title>
    <style>
        body {
            background-color: #f8f9fa;
            color: #343a40;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 80px 20px;
        }

        h1 {
            font-size: 96px;
            margin-bottom: 10px;
            color: #dc3545;
        }

        .error p {
            font-size: 18px;
            color: #6c757d;
        }

        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        .container {
            max-width: 600px;
            margin: auto;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
        <div class="error">
            <p><?php echo htmlspecialchars($data['error']); ?></p>
        </div>
        <div class="error">
            <p><?php echo htmlspecialchars($data['message'] ?? ''); ?></p>
        </div>
        <a href="/">Back to Home</a>
    </div>
</body>

</html>