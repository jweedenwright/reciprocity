const marked = require('marked');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

////////////////////////////////////////////////////////////
// App Endpoints and Configuration

// Enable CORS so your Vue app can communicate with this API
app.use(cors());
app.use(express.json());

// API Endpoint Test
app.get('/api/data', (req, res) => {
    const html = marked.parse('# Marked in Node.js');
    res.json({ message: html });
});

// Cookbook Endpoint (all recipes)
app.get('/api/cookbook', async (req, res) => { 
    try {
        const files = await getFilesInDirectory(TARGET_FOLDER_ID);
        res.json(files);
    } catch (error) {
        //console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch cookbook files: ' + error });
    }
});

// Setup Port for API
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Google Drive functions
const KEY_FILE_PATH = path.join(__dirname, 'cookbook-501814-bef543f9b6ac.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Directory of all cookbook md files
const TARGET_FOLDER_ID = '1Ar6acSTK6FoDlK1nr9eHmNmuKczAnmhR';


async function getFilesInDirectory(FOLDER_ID) {

    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: SCOPES,
    });

    // 4. Force the auth instance to resolve into a valid OAuth2 Authenticated Client
    //const authClient = await auth.getClient();

    // 5. Initialize the drive instance using the active client
    const drive = google.drive({ 
      version: 'v3', 
      auth: auth  //authClient 
    });

    try {
        // 3. List files in the specified folder
        const res = await drive.files.list({
            pageSize: 100,
            fields: 'nextPageToken, files(id, name)',
            q: `'${FOLDER_ID}' in parents and trashed = false`
        });

        const files = res.data.files;

        if (!files || files.length === 0) {
            console.log('No files found in this directory');
            return [];
        }

        console.log('Files found: ');
        files.forEach((file) => {
            console.log(`${file.name} (${file.id})`);
        });

        return files;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }   
}