/**
 * Vector Map Module (MapLibre GL)
 */
export const initVectorMap = () => {
    const mapContainer = document.getElementById('map-vector');
    
    if (!mapContainer) return;

    if (!window.maplibregl) {
        console.error("❌ MapLibre GL library not found. Please ensure the CDN script is loaded.");
        mapContainer.innerHTML = '<div class="p-5 text-center text-danger">Failed to load MapLibre GL library.</div>';
        return;
    }

    console.log("🌍 Initializing Vector Map...");

    const map = new maplibregl.Map({
        container: 'map-vector',
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [78.9629, 20.5937],
        zoom: 2.5,
        maxZoom: 10,
        antialias: true
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    const nodes = [
        { coords: [88.3639, 22.5726], name: "Kolkata Node", status: "Operational", color: "#2563eb" },
        { coords: [-122.4194, 37.7749], name: "San Francisco Node", status: "High Load", color: "#f59e0b" },
        { coords: [-0.1278, 51.5074], name: "London Node", status: "Stable", color: "#2563eb" },
        { coords: [139.6917, 35.6895], name: "Tokyo Node", status: "Operational", color: "#2563eb" }
    ];

    nodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'xivig-marker';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.background = node.color;
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #fff';
        el.style.boxShadow = `0 0 10px ${node.color}66`;

        new maplibregl.Marker(el)
            .setLngLat(node.coords)
            .setPopup(
                new maplibregl.Popup({ offset: 25, closeButton: false })
                .setHTML(`
                    <div style="color: #1e293b;">
                        <div style="font-weight: 800; font-size: 14px;">${node.name}</div>
                        <div style="font-size: 12px; color: ${node.color}; font-weight: 600;">● ${node.status}</div>
                    </div>
                `)
            )
            .addTo(map);
    });

    // Smoothly transition map on load
    map.on('load', () => {
        map.flyTo({
            zoom: 3,
            speed: 0.8,
            curve: 1
        });
        
        // Fix resize issue if sidebar is toggled
        window.addEventListener('resize', () => map.resize());
    });
};
