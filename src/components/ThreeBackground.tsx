import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Cores High-Tech / Dark Mode
        const BG_COLOR = 0x050505;
        const INK_COLOR = 0x38bdf8; // Azul neon sutil
        const INK_GHOST = 0x1e293b;
        const STATIONS = 4;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(BG_COLOR);
        scene.fog = new THREE.FogExp2(BG_COLOR, 0.012);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 2, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const inkGroups: THREE.Group[] = [];
        const particles: THREE.Mesh[] = [];
        let time = 0;
        let scrollProgress = 0;

        // Materiais
        const inkLineMaterial = (opacity = 1) => new THREE.LineBasicMaterial({ color: INK_COLOR, transparent: true, opacity });
        const inkMeshMaterial = (opacity = 0.08) => new THREE.MeshBasicMaterial({ color: INK_COLOR, transparent: true, opacity, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });

        // --- Lógica Procedural (Simplificada do seu original para focar na performance) ---
        function createBranch(startPoint: THREE.Vector3, direction: THREE.Vector3, length: number, depth: number, group: THREE.Group) {
            if (depth <= 0 || length < 0.1) return;
            const points = [];
            let current = startPoint.clone();
            let dir = direction.clone().normalize();

            for (let i = 0; i <= 12; i++) {
                const t = i / 12;
                const pt = current.clone().add(dir.clone().multiplyScalar(length * t)).add(new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, 0));
                points.push(pt);
                current = pt.clone();
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
            group.add(new THREE.Line(geom, inkLineMaterial(0.3 + depth * 0.15)));

            if (depth > 1) {
                const endPt = points[points.length - 1];
                const newDir = dir.clone().add(new THREE.Vector3((Math.random() - 0.5), Math.random() * 0.4, (Math.random() - 0.5)));
                createBranch(endPt, newDir, length * 0.6, depth - 1, group);
            }
        }

        function createPlantCluster(x: number, y: number, z: number, scale: number) {
            const group = new THREE.Group();
            group.position.set(x, y, z);
            group.scale.setScalar(scale);
            for (let i = 0; i < 4; i++) {
                const dir = new THREE.Vector3(Math.sin(i) * 0.3, 0.8 + Math.random() * 0.3, Math.cos(i) * 0.3);
                createBranch(new THREE.Vector3(), dir, 1.2, 3, group);
            }
            scene.add(group);
            return group;
        }

        // Gerar ambiente digital
        inkGroups.push(createPlantCluster(-5, 0, -3, 1.2));
        inkGroups.push(createPlantCluster(15, 0, -4, 1.3));
        inkGroups.push(createPlantCluster(-10, 0, -18, 1.5));

        // Partículas flutuantes
        for (let i = 0; i < 100; i++) {
            const p = new THREE.Mesh(new THREE.CircleGeometry(0.02, 5), inkMeshMaterial(0.3));
            p.position.set((Math.random() - 0.5) * 30, Math.random() * 10, (Math.random() - 0.5) * 20 - 5);
            scene.add(p);
            particles.push(p);
        }

        // Câmera Lookats
        const cameraStations = [
            { pos: new THREE.Vector3(0, 2.5, 12), look: new THREE.Vector3(0, 1, 0) },
            { pos: new THREE.Vector3(-8, 3, 6), look: new THREE.Vector3(-14, 1.5, -3) },
            { pos: new THREE.Vector3(8, 2.5, 8), look: new THREE.Vector3(14, 1.5, -2) },
            { pos: new THREE.Vector3(0, 4, -8), look: new THREE.Vector3(0, 1.5, -19) }
        ];

        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        };
        window.addEventListener('scroll', onScroll);

        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.01;

            const exactStation = scrollProgress * (STATIONS - 1);
            const fromIdx = Math.floor(exactStation);
            const toIdx = Math.min(fromIdx + 1, STATIONS - 1);
            const localT = exactStation - fromIdx;

            // Interpolação suave da câmera
            camera.position.lerp(cameraStations[fromIdx].pos.clone().lerp(cameraStations[toIdx].pos, localT), 0.08);
            const currentLook = new THREE.Vector3();
            camera.getWorldDirection(currentLook);
            const targetLook = cameraStations[fromIdx].look.clone().lerp(cameraStations[toIdx].look, localT).sub(camera.position).normalize();
            camera.lookAt(camera.position.clone().add(currentLook.lerp(targetLook, 0.06).multiplyScalar(10)));

            // Animação orgânica
            particles.forEach((p, i) => {
                p.position.y += Math.sin(time + i) * 0.005;
                p.position.x += Math.cos(time + i) * 0.005;
            });

            inkGroups.forEach((g, i) => {
                g.rotation.z = Math.sin(time * 0.4 + i) * 0.02;
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('scroll', onScroll);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
}