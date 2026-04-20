import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const PAPER_COLOR = 0xF5F0E8;
        const INK_COLOR = 0x1A1714;
        const STATIONS = 4;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(PAPER_COLOR);
        scene.fog = new THREE.FogExp2(PAPER_COLOR, 0.012);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 2, 12);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const inkGroups: THREE.Group[] = [];
        const particles: THREE.Mesh[] = [];
        let time = 0;
        let scrollProgress = 0;
        let animId: number;

        function inkLineMat(opacity = 1) {
            return new THREE.LineBasicMaterial({ color: INK_COLOR, transparent: true, opacity });
        }

        function inkMeshMat(opacity = 0.08) {
            return new THREE.MeshBasicMaterial({
                color: INK_COLOR, transparent: true, opacity,
                side: THREE.DoubleSide,
            });
        }

        function createBranch(
            startPoint: THREE.Vector3,
            direction: THREE.Vector3,
            length: number,
            depth: number,
            group: THREE.Group
        ) {
            if (depth <= 0 || length < 0.1) return;
            const points: THREE.Vector3[] = [];
            let current = startPoint.clone();
            const dir = direction.clone().normalize();
            for (let i = 0; i <= 12; i++) {
                const t = i / 12;
                const wobble = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.15 * length,
                    (Math.random() - 0.5) * 0.08 * length,
                    (Math.random() - 0.5) * 0.15 * length
                );
                const pt = current.clone()
                    .add(dir.clone().multiplyScalar(length * t))
                    .add(wobble.multiplyScalar(t));
                pt.y -= t * t * length * 0.05;
                points.push(pt);
                current = pt.clone();
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
            group.add(new THREE.Line(geom, inkLineMat(0.3 + depth * 0.15)));

            if (depth > 1) {
                const endPt = points[points.length - 1];
                const numBranches = Math.floor(Math.random() * 3) + 1;
                for (let b = 0; b < numBranches; b++) {
                    const newDir = dir.clone();
                    newDir.x += (Math.random() - 0.5) * 1.2;
                    newDir.y += Math.random() * 0.4 - 0.1;
                    newDir.z += (Math.random() - 0.5) * 1.2;
                    createBranch(endPt, newDir, length * 0.6, depth - 1, group);
                }
            }

            if (depth <= 2) {
                const tip = points[points.length - 1];
                const leafSize = 0.2 + Math.random() * 0.3;
                const leafMesh = new THREE.Mesh(new THREE.CircleGeometry(leafSize * 0.5, 8), inkMeshMat(0.07));
                leafMesh.position.copy(tip);
                leafMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                group.add(leafMesh);
            }
        }

        function createPlantCluster(x: number, y: number, z: number, scale: number, complexity: number) {
            const group = new THREE.Group();
            group.position.set(x, y, z);
            group.scale.setScalar(scale);
            for (let i = 0; i < complexity; i++) {
                const angle = (i / complexity) * Math.PI * 2 + Math.random() * 0.5;
                const dir = new THREE.Vector3(Math.sin(angle) * 0.3, 0.8 + Math.random() * 0.3, Math.cos(angle) * 0.3);
                const startJitter = new THREE.Vector3((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3);
                createBranch(startJitter, dir, 1.2 + Math.random() * 0.8, 3 + Math.floor(Math.random() * 2), group);
            }
            scene.add(group);
            return group;
        }

        function createCrosshatchGround() {
            const group = new THREE.Group();
            for (let i = 0; i < 80; i++) {
                const x1 = (Math.random() - 0.5) * 60;
                const z1 = (Math.random() - 0.5) * 60;
                const len = 0.5 + Math.random() * 2;
                const angle = Math.random() * Math.PI;
                const pts = [
                    new THREE.Vector3(x1, -0.01, z1),
                    new THREE.Vector3(x1 + Math.cos(angle) * len, -0.01, z1 + Math.sin(angle) * len),
                ];
                const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), inkLineMat(0.04 + Math.random() * 0.08));
                group.add(line);
            }
            scene.add(group);
        }

        function createInkCircle(x: number, y: number, z: number, radius: number, wobble: number) {
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= 80; i++) {
                const a = (i / 80) * Math.PI * 2;
                const r = radius + (Math.random() - 0.5) * wobble;
                pts.push(new THREE.Vector3(x + Math.cos(a) * r, y + Math.sin(a) * r, z));
            }
            scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), inkLineMat(0.2)));
        }

        function createFloatingParticles() {
            for (let i = 0; i < 60; i++) {
                const size = 0.01 + Math.random() * 0.03;
                const p = new THREE.Mesh(new THREE.CircleGeometry(size, 5), inkMeshMat(0.05 + Math.random() * 0.1));
                p.position.set((Math.random() - 0.5) * 30, Math.random() * 8, (Math.random() - 0.5) * 20 - 5);
                Object.assign(p.userData, {
                    baseX: p.position.x, baseY: p.position.y,
                    speed: 0.2 + Math.random() * 0.4,
                    phase: Math.random() * Math.PI * 2,
                    drift: 0.3 + Math.random() * 0.5,
                });
                scene.add(p);
                particles.push(p);
            }
        }

        // Build world
        createCrosshatchGround();
        inkGroups.push(createPlantCluster(-5, 0, -3, 1.2, 5));
        inkGroups.push(createPlantCluster(6, 0, -2, 0.8, 4));
        inkGroups.push(createPlantCluster(-15, 0, -5, 1.4, 6));
        inkGroups.push(createPlantCluster(-12, 0, 0, 1.0, 5));
        inkGroups.push(createPlantCluster(15, 0, -4, 1.3, 5));
        inkGroups.push(createPlantCluster(12, 0, 1, 1.1, 6));
        inkGroups.push(createPlantCluster(0, 0, -18, 1.5, 7));
        inkGroups.push(createPlantCluster(-4, 0, -22, 0.9, 4));
        createInkCircle(0, 3, -5, 2.5, 0.15);
        createInkCircle(-14, 2.5, -3, 1.8, 0.1);
        createInkCircle(14, 3.2, -2, 2.0, 0.12);
        createInkCircle(0, 2.8, -20, 3.0, 0.2);
        createFloatingParticles();

        const cameraStations = [
            { pos: new THREE.Vector3(0, 2.5, 12), look: new THREE.Vector3(0, 1, 0) },
            { pos: new THREE.Vector3(-10, 3, 6), look: new THREE.Vector3(-14, 1.5, -3) },
            { pos: new THREE.Vector3(10, 2.5, 8), look: new THREE.Vector3(14, 1.5, -2) },
            { pos: new THREE.Vector3(0, 4, -8), look: new THREE.Vector3(0, 1.5, -19) },
        ];

        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        };
        window.addEventListener('scroll', onScroll);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        function smoothstep(t: number) { return t * t * (3 - 2 * t); }

        const animate = () => {
            animId = requestAnimationFrame(animate);
            time += 0.01;

            const exact = scrollProgress * (STATIONS - 1);
            const from = Math.floor(exact);
            const to = Math.min(from + 1, STATIONS - 1);
            const lt = smoothstep(exact - from);

            const camPos = new THREE.Vector3().lerpVectors(cameraStations[from].pos, cameraStations[to].pos, lt);
            const camLook = new THREE.Vector3().lerpVectors(cameraStations[from].look, cameraStations[to].look, lt);
            camPos.y += Math.sin(time * 0.5) * 0.08;
            camPos.x += Math.sin(time * 0.3) * 0.04;

            camera.position.lerp(camPos, 0.08);
            const currentDir = new THREE.Vector3();
            camera.getWorldDirection(currentDir);
            const targetDir = camLook.clone().sub(camera.position).normalize();
            currentDir.lerp(targetDir, 0.06);
            camera.lookAt(camera.position.clone().add(currentDir.multiplyScalar(10)));

            particles.forEach(p => {
                const d = p.userData;
                p.position.x = d.baseX + Math.sin(time * d.speed + d.phase) * d.drift;
                p.position.y = d.baseY + Math.cos(time * d.speed * 0.7 + d.phase) * 0.3;
                p.rotation.z = time * d.speed * 0.2;
            });

            inkGroups.forEach((g, i) => {
                g.rotation.z = Math.sin(time * 0.4 + i * 0.7) * 0.015;
                g.rotation.x = Math.cos(time * 0.3 + i * 0.5) * 0.01;
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        />
    );
}