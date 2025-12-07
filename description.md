The future of AI extends beyond digital spaces into the physical world. This capstone quarter introduces Physical AI—AI systems that function in reality and comprehend physical laws. Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac.
Module 1: The Robotic Nervous System (ROS 2)
Focus: Middleware for robot control.
ROS 2 Nodes, Topics, and Services.
Bridging Python Agents to ROS controllers using rclpy.
Understanding URDF (Unified Robot Description Format) for humanoids.


Module 2: The Digital Twin (Gazebo & Unity)
Focus: Physics simulation and environment building.
Simulating physics, gravity, and collisions in Gazebo.
High-fidelity rendering and human-robot interaction in Unity.
Simulating sensors: LiDAR, Depth Cameras, and IMUs.


Module 3: The AI-Robot Brain (NVIDIA Isaac™)
Focus: Advanced perception and training.
NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation.
Isaac ROS: Hardware-accelerated VSLAM (Visual SLAM) and navigation.
Nav2: Path planning for bipedal humanoid movement.


Module 4: Vision-Language-Action (VLA)
Focus: The convergence of LLMs and Robotics.	
Voice-to-Action: Using OpenAI Whisper for voice commands.
Cognitive Planning: Using LLMs to translate natural language ("Clean the room") into a sequence of ROS 2 actions.
Capstone Project: The Autonomous Humanoid. A final project where a simulated robot receives a voice command, plans a path, navigates obstacles, identifies an object using computer vision, and manipulates it.
Learning Outcomes
Understand Physical AI principles and embodied intelligence
Master ROS 2 (Robot Operating System) for robotic control
Simulate robots with Gazebo and Unity
Develop with NVIDIA Isaac AI robot platform
Design humanoid robots for natural interactions
Integrate GPT models for conversational robotics
Weekly Breakdown
Weeks 1-2: Introduction to Physical AI
Foundations of Physical AI and embodied intelligence
From digital AI to robots that understand physical laws
Overview of humanoid robotics landscape
Sensor systems: LIDAR, cameras, IMUs, force/torque sensors
Weeks 3-5: ROS 2 Fundamentals
ROS 2 architecture and core concepts
Nodes, topics, services, and actions
Building ROS 2 packages with Python
Launch files and parameter management
Weeks 6-7: Robot Simulation with Gazebo
Gazebo simulation environment setup
URDF and SDF robot description formats
Physics simulation and sensor simulation
Introduction to Unity for robot visualization
Weeks 8-10: NVIDIA Isaac Platform
NVIDIA Isaac SDK and Isaac Sim
AI-powered perception and manipulation
Reinforcement learning for robot control
Sim-to-real transfer techniques
Weeks 11-12: Humanoid Robot Development
Humanoid robot kinematics and dynamics
Bipedal locomotion and balance control
Manipulation and grasping with humanoid hands
Natural human-robot interaction design

Week 13: Conversational Robotics
Integrating GPT models for conversational AI in robots
Speech recognition and natural language understanding
Multi-modal interaction: speech, gesture, vision
Assessments
ROS 2 package development project
Gazebo simulation implementation
Isaac-based perception pipeline
Capstone: Simulated humanoid robot with conversational AI

Hardware Requirements
This course is technically demanding. It sits at the intersection of three heavy computational loads: Physics Simulation (Isaac Sim/Gazebo), Visual Perception (SLAM/Computer Vision), and Generative AI (LLMs/VLA).

Because the capstone involves a "Simulated Humanoid," the primary investment must be in High-Performance Workstations. However, to fulfill the "Physical AI" promise, you also need Edge Computing Kits (brains without bodies) or specific robot hardware.

1. The "Digital Twin" Workstation (Required per Student)
This is the most critical component. NVIDIA Isaac Sim is an Omniverse application that requires "RTX" (Ray Tracing) capabilities. Standard laptops (MacBooks or non-RTX Windows machines) will not work.
GPU (The Bottleneck): NVIDIA RTX 4070 Ti (12GB VRAM) or higher.
Why: You need high VRAM to load the USD (Universal Scene Description) assets for the robot and environment, plus run the VLA (Vision-Language-Action) models simultaneously.
Ideal: RTX 3090 or 4090 (24GB VRAM) allows for smoother "Sim-to-Real" training.
CPU: Intel Core i7 (13th Gen+) or AMD Ryzen 9.
Why: Physics calculations (Rigid Body Dynamics) in Gazebo/Isaac are CPU-intensive.
RAM: 64 GB DDR5 (32 GB is the absolute minimum, but will crash during complex scene rendering).
OS: Ubuntu 22.04 LTS.
Note: While Isaac Sim runs on Windows, ROS 2 (Humble/Iron) is native to Linux. Dual-booting or dedicated Linux machines are mandatory for a friction-free experience.


2. The "Physical AI" Edge Kit
Since a full humanoid robot is expensive, students learn "Physical AI" by setting up the nervous system on a desk before deploying it to a robot. This kit covers Module 3 (Isaac ROS) and Module 4 (VLA).
The Brain: NVIDIA Jetson Orin Nano (8GB) or Orin NX (16GB).
Role: This is the industry standard for embodied AI. Students will deploy their ROS 2 nodes here to understand resource constraints vs. their powerful workstations.
The Eyes (Vision): Intel RealSense D435i or D455.
Role: Provides RGB (Color) and Depth (Distance) data. Essential for the VSLAM and Perception modules.
The Inner Ear (Balance): Generic USB IMU (BNO055) (Often built into the RealSense D435i or Jetson boards, but a separate module helps teach IMU calibration).
Voice Interface: A simple USB Microphone/Speaker array (e.g., ReSpeaker) for the "Voice-to-Action" Whisper integration.
3. The Robot Lab
For the "Physical" part of the course, you have three tiers of options depending on budget.
Option A: The "Proxy" Approach (Recommended for Budget)
Use a quadruped (dog) or a robotic arm as a proxy. The software principles (ROS 2, VSLAM, Isaac Sim) transfer 90% effectively to humanoids.
Robot: Unitree Go2 Edu (~$1,800 - $3,000).
Pros: Highly durable, excellent ROS 2 support, affordable enough to have multiple units.
Cons: Not a biped (humanoid).
Option B: The "Miniature Humanoid" Approach
Small, table-top humanoids.
Robot: Unitree H1 is too expensive ($90k+), so look at Unitree G1 (~$16k) or Robotis OP3 (older, but stable, ~$12k).
Budget Alternative: Hiwonder TonyPi Pro (~$600).
Warning: The cheap kits (Hiwonder) usually run on Raspberry Pi, which cannot run NVIDIA Isaac ROS efficiently. You would use these only for kinematics (walking) and use the Jetson kits for AI.
Option C: The "Premium" Lab (Sim-to-Real specific)
If the goal is to actually deploy the Capstone to a real humanoid:
Robot: Unitree G1 Humanoid.
Why: It is one of the few commercially available humanoids that can actually walk dynamically and has an SDK open enough for students to inject their own ROS 2 controllers.

4. Summary of Architecture
To teach this successfully, your lab infrastructure should look like this:
Component
Hardware
Function
Sim Rig
PC with RTX 4080 + Ubuntu 22.04
Runs Isaac Sim, Gazebo, Unity, and trains LLM/VLA models.
Edge Brain
Jetson Orin Nano
Runs the "Inference" stack. Students deploy their code here.
Sensors
RealSense Camera + Lidar
Connected to the Jetson to feed real-world data to the AI.
Actuator
Unitree Go2 or G1 (Shared)
Receives motor commands from the Jetson.


If you do not have access to RTX-enabled workstations, we must restructure the course to rely entirely on cloud-based instances (like AWS RoboMaker or NVIDIA's cloud delivery for Omniverse), though this introduces significant latency and cost complexity.

Building a "Physical AI" lab is a significant investment. You will have to choose between building a physical On-Premise Lab at Home (High CapEx) versus running a Cloud-Native Lab (High OpEx).

Option 2 High OpEx: The "Ether" Lab (Cloud-Native)
Best for: Rapid deployment, or students with weak laptops.
1. Cloud Workstations (AWS/Azure) Instead of buying PCs, you rent instances.
Instance Type: AWS g5.2xlarge (A10G GPU, 24GB VRAM) or g6e.xlarge.
Software: NVIDIA Isaac Sim on Omniverse Cloud (requires specific AMI).
Cost Calculation:
Instance cost: ~$1.50/hour (spot/on-demand mix).
Usage: 10 hours/week × 12 weeks = 120 hours.
Storage (EBS volumes for saving environments): ~$25/quarter.
Total Cloud Bill: ~$205 per quarter.
2. Local "Bridge" Hardware You cannot eliminate hardware entirely for "Physical AI." You still need the edge devices to deploy the code physically.
Edge AI Kits: You still need the Jetson Kit for the physical deployment phase.
Cost: $700 (One-time purchase).
Robot: You still need one physical robot for the final demo.
Cost: $3,000 (Unitree Go2 Standard).
The Economy Jetson Student Kit
Best for: Learning ROS 2, Basic Computer Vision, and Sim-to-Real control.
Component
Model
Price (Approx.)
Notes
The Brain
NVIDIA Jetson Orin Nano Super Dev Kit (8GB)
$249
New official MSRP (Price dropped from ~$499). Capable of 40 TOPS.
The Eyes
Intel RealSense D435i
$349
Includes IMU (essential for SLAM). Do not buy the D435 (non-i).
The Ears
ReSpeaker USB Mic Array v2.0
$69
Far-field microphone for voice commands (Module 4).
Wi-Fi
(Included in Dev Kit)
$0
The new "Super" kit includes the Wi-Fi module pre-installed.
Power/Misc
SD Card (128GB) + Jumper Wires
$30
High-endurance microSD card required for the OS.
TOTAL


~$700 per kit




3. The Latency Trap (Hidden Cost)
Simulating in the cloud works well, but controlling a real robot from a cloud instance is dangerous due to latency.
Solution: Students train in the Cloud, download the model (weights), and flash it to the local Jetson kit.
