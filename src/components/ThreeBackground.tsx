import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

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
        currentMount.appendChild(renderer.domElement);

        const inkGroups: THREE.Group[] = [];
        const particles: THREE.Mesh[] = [];
        const dataRings: THREE.LineSegments[] = [];
        const techNetworks: THREE.Group[] = [];

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

        // --- FUNÇÕES ORIGINAIS ---
        function createBranch(startPoint: THREE.Vector3, direction: THREE.Vector3, length: number, depth: number, group: THREE.Group) {
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
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), inkLineMat(0.04 + Math.random() * 0.08)));
            }
            scene.add(group);
        }

        // --- AS 5 NOVAS ADIÇÕES DE PORTFÓLIO ---

        // 1. Trilha de Navegação
        function createTimelinePath(stations: { look: THREE.Vector3 }[]) {
            const pts = stations.map(s => new THREE.Vector3(s.look.x, 0.02, s.look.z));
            const curve = new THREE.CatmullRomCurve3(pts);
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
            scene.add(new THREE.Line(geom, inkLineMat(0.25)));
        }

        // 2. Rede Full Stack (Network Graph)
        function createNetworkGraph(x: number, y: number, z: number, spread: number) {
            const group = new THREE.Group();
            group.position.set(x, y, z);
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i < 20; i++) {
                pts.push(new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread * 0.5, (Math.random() - 0.5) * spread));
            }
            pts.forEach(p => {
                const dot = new THREE.Mesh(new THREE.CircleGeometry(0.04, 6), inkMeshMat(0.4));
                dot.position.copy(p);
                group.add(dot);
            });
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    if (pts[i].distanceTo(pts[j]) < spread * 0.35) {
                        const lineGeom = new THREE.BufferGeometry().setFromPoints([pts[i], pts[j]]);
                        group.add(new THREE.Line(lineGeom, inkLineMat(0.08)));
                    }
                }
            }
            scene.add(group);
            techNetworks.push(group);
        }

        // 3. Molduras de Projetos
        function createProjectFrame(x: number, y: number, z: number, rotY: number) {
            const width = 4;
            const height = 2.5;
            const geom = new THREE.EdgesGeometry(new THREE.PlaneGeometry(width, height));
            const frame = new THREE.LineSegments(geom, inkLineMat(0.2));
            frame.position.set(x, y, z);
            frame.rotation.y = rotY;

            // Adiciona "cantoneiras" para dar um ar mais técnico
            const cornerGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const corners = [
                new THREE.Vector3(-width / 2, height / 2, 0), new THREE.Vector3(width / 2, height / 2, 0),
                new THREE.Vector3(-width / 2, -height / 2, 0), new THREE.Vector3(width / 2, -height / 2, 0)
            ];
            corners.forEach(pos => {
                const corner = new THREE.Mesh(cornerGeom, inkMeshMat(0.5));
                corner.position.copy(pos);
                frame.add(corner);
            });

            scene.add(frame);
        }

        // 4. Órbitas de Dados
        function createDataOrbit(x: number, y: number, z: number, radius: number) {
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
            }
            const geom = new THREE.BufferGeometry().setFromPoints(pts);
            // Usando LineSegments para fazer a linha ficar tracejada/pontilhada
            const orbit = new THREE.LineSegments(geom, inkLineMat(0.15));
            orbit.position.set(x, y, z);
            scene.add(orbit);
            dataRings.push(orbit);
        }

        // 5. Símbolos Flutuantes (Tech Runes em vez de apenas círculos)
        function createTechParticles() {
            const geometries = [
                new THREE.CircleGeometry(0.03, 3), // Triângulos
                new THREE.CircleGeometry(0.025, 4), // Losangos
                new THREE.EdgesGeometry(new THREE.BoxGeometry(0.06, 0.06, 0.06)) // Cubos wireframe
            ];

            for (let i = 0; i < 70; i++) {
                const geom = geometries[Math.floor(Math.random() * geometries.length)];
                const mat = geom.type === 'EdgesGeometry' ? inkLineMat(0.3) : inkMeshMat(0.15);
                const p = geom.type === 'EdgesGeometry' ? new THREE.LineSegments(geom, mat) : new THREE.Mesh(geom, mat);

                p.position.set((Math.random() - 0.5) * 30, Math.random() * 8, (Math.random() - 0.5) * 20 - 5);
                Object.assign(p.userData, {
                    baseX: p.position.x, baseY: p.position.y,
                    speed: 0.15 + Math.random() * 0.3,
                    phase: Math.random() * Math.PI * 2,
                    drift: 0.2 + Math.random() * 0.4,
                    rotSpeed: (Math.random() - 0.5) * 0.02
                });
                scene.add(p);
                particles.push(p as THREE.Mesh);
            }
        }

        // --- CONSTRUÇÃO DO MUNDO ---

        const cameraStations = [
            { pos: new THREE.Vector3(0, 2.5, 12), look: new THREE.Vector3(0, 1, 0) }, // Hero
            { pos: new THREE.Vector3(-10, 3, 6), look: new THREE.Vector3(-14, 1.5, -3) }, // Sobre/Skills
            { pos: new THREE.Vector3(10, 2.5, 8), look: new THREE.Vector3(14, 1.5, -2) }, // Projetos
            { pos: new THREE.Vector3(0, 4, -8), look: new THREE.Vector3(0, 1.5, -19) }, // Contato
        ];

        createCrosshatchGround();

        // Chamando as novas funções
        createTimelinePath(cameraStations);
        createNetworkGraph(-14, 2, -5, 8); // Atrás da seção 2
        createNetworkGraph(14, 3, -4, 10); // Atrás da seção 3

        createProjectFrame(-14, 1.5, -4, Math.PI / 6); // Frame para estação 2
        createProjectFrame(14, 1.5, -3, -Math.PI / 6); // Frame para estação 3
        createProjectFrame(0, 1.5, -20, 0); // Frame final

        createDataOrbit(0, 0.5, 0, 4);
        createDataOrbit(-14, 0.2, -3, 3);
        createDataOrbit(14, 0.2, -2, 3.5);

        createTechParticles();

        // Plantas originais
        inkGroups.push(createPlantCluster(-5, 0, -3, 1.2, 5));
        inkGroups.push(createPlantCluster(6, 0, -2, 0.8, 4));
        inkGroups.push(createPlantCluster(-15, 0, -5, 1.4, 6));
        inkGroups.push(createPlantCluster(-12, 0, 0, 1.0, 5));
        inkGroups.push(createPlantCluster(15, 0, -4, 1.3, 5));
        inkGroups.push(createPlantCluster(12, 0, 1, 1.1, 6));

        // Eventos
        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));
        };
        window.addEventListener('scroll', onScroll);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        function smoothstep(t: number) { return t * t * (3 - 2 * t); }

        // Loop de Animação
        const animate = () => {
            animId = requestAnimationFrame(animate);
            time += 0.01;

            const exact = scrollProgress * (STATIONS - 1);
            const from = Math.floor(exact);
            const to = Math.min(from + 1, STATIONS - 1);
            const lt = smoothstep(exact - from);

            const camPos = new THREE.Vector3().lerpVectors(cameraStations[from].pos, cameraStations[to].pos, lt);
            const camLook = new THREE.Vector3().lerpVectors(cameraStations[from].look, cameraStations[to].look, lt);

            // Suave oscilação da câmera
            camPos.y += Math.sin(time * 0.5) * 0.08;
            camPos.x += Math.sin(time * 0.3) * 0.04;

            camera.position.lerp(camPos, 0.08);
            const currentDir = new THREE.Vector3();
            camera.getWorldDirection(currentDir);
            const targetDir = camLook.clone().sub(camera.position).normalize();
            currentDir.lerp(targetDir, 0.06);
            camera.lookAt(camera.position.clone().add(currentDir.multiplyScalar(10)));

            // Animação das novas partículas de código
            particles.forEach(p => {
                const d = p.userData;
                p.position.x = d.baseX + Math.sin(time * d.speed + d.phase) * d.drift;
                p.position.y = d.baseY + Math.cos(time * d.speed * 0.7 + d.phase) * 0.3;
                p.rotation.x += d.rotSpeed;
                p.rotation.y += d.rotSpeed;
                p.rotation.z = time * d.speed * 0.2;
            });

            // Gira lentamente as plantas
            inkGroups.forEach((g, i) => {
                g.rotation.z = Math.sin(time * 0.4 + i * 0.7) * 0.015;
                g.rotation.x = Math.cos(time * 0.3 + i * 0.5) * 0.01;
            });

            // Gira os anéis de dados e redes de conexão
            dataRings.forEach((ring, i) => {
                ring.rotation.y = time * 0.2 * (i % 2 === 0 ? 1 : -1);
                ring.rotation.x = Math.sin(time * 0.5 + i) * 0.1;
            });
            techNetworks.forEach((net, i) => {
                net.position.y += Math.sin(time * 0.5 + i) * 0.002;
                net.rotation.y = Math.sin(time * 0.2 + i) * 0.1;
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (currentMount && renderer.domElement.parentNode === currentMount) {
                currentMount.removeChild(renderer.domElement);
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