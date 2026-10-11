# Research log

Research was used only to clarify the supplied lectures,repair typos/legacy APIs,and connect their exercises to the inspected local source. Notes below identify the lecture anchor and exact addition. Some docs.ros.org pages blocked automated access;their official Humble-branch raw source on GitHub was used where noted.

Read the source/code audit separately for findings from the downloaded archive and your historical setup notes. No robot test or simulation was run while making this game.

## w1-s8 — Demonstration: what ROS adds

- Source: [Official ROS2 platform policy](https://raw.githubusercontent.com/ros-infrastructure/rep/master/rep-2000.rst)
- Joined to: Week 1 demonstration 19–20
- Added: Checked distribution support and Ubuntu targets. Added a historical-table warning and the Humble/Ubuntu 22.04 baseline.

## w1-s10 — Demonstration: installing a package versus building source

- Source: [Lecturer Workshop 1: introduction](https://github.com/kivrakh/KV6022_limo_ros2/wiki/Workshop-1-%E2%80%90-Introduction)
- Joined to: Week 1 demonstration pp35–37; optional practical context
- Added: Checked the original workshop: terminal practice, Turtlesim and Gazebo introduce ROS concepts. Added its primary-source link as optional practice; adapt installation steps to the existing Humble container.

## w2-s7 — Demonstration: build tools and the exact workspace tree

- Source: [Official Humble package tutorial](https://raw.githubusercontent.com/ros2/ros2_documentation/humble/source/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.rst)
- Joined to: Week 2 demonstration 4–6
- Added: Verified workspace/src organisation and the ament versus colcon distinction. Added Python build-type clarification.

## w2-s8 — Demonstration: packages and the supplied seven

- Source: [Official Humble package tutorial](https://raw.githubusercontent.com/ros2/ros2_documentation/humble/source/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.rst)
- Joined to: Week 2 demonstration 7–10
- Added: Checked setup files and executable discovery. Added the source-file versus installed entry-point distinction.

## w2-s9 — Demonstration: nodes, topics, services and actions

- Source: [Official Humble nodes tutorial](https://raw.githubusercontent.com/ros2/ros2_documentation/humble/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Nodes/Understanding-ROS2-Nodes.rst)
- Joined to: Week 2 demonstration 11–12
- Added: Verified graph inspection and clarified that one executable may contain several nodes.

## w3-s13 — Demonstration · Publish and subscribe in Python

- Source: [Official Humble Python publisher/subscriber tutorial](https://raw.githubusercontent.com/ros2/ros2_documentation/humble/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst)
- Joined to: Week 3 demonstration pp3–6
- Added: Added the timer-and-spin pattern and clarified callback processing, while repairing the slide’s trailing colon.

## w3-s14 — Demonstration · Services and node parameters

- Source: [Official Humble parameter tutorial](https://raw.githubusercontent.com/ros2/ros2_documentation/humble/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Parameters/Understanding-ROS2-Parameters.rst)
- Joined to: Week 3 demonstration pp10–11
- Added: Verified get versus set and the node-owned parameter model; added the exact correction for demonstration page 11.

## w4-s4 — Laser scans, endpoints, 3D scanners and scan matching

- Source: [ROS 2 Humble LaserScan message](https://github.com/ros2/common_interfaces/blob/humble/sensor_msgs/msg/LaserScan.msg)
- Joined to: Week 4 lecture p14; demo p24
- Added: Verified metres, radians, first-ray timestamp, angle fields and valid-range filtering so the endpoint example maps correctly to ROS data.

## w4-s7 — Demonstration: Gazebo, its interface and ROS sensor plugins

- Source: [Gazebo Classic project page](https://classic.gazebosim.org/)
- Joined to: Week 4 demo pp3–8
- Added: Checked the January 2025 end-of-life notice and different-plugin warning. This explains why newer tutorials may not match the course commands.

## w4-s8 — Demonstration: coordinate frames and the TF tree

- Source: [ROS REP 103 coordinate conventions](https://raw.githubusercontent.com/ros-infrastructure/rep/master/rep-0103.rst)
- Joined to: Week 4 demo p11
- Added: Verified SI units, body-axis directions, and the camera optical-frame exception to prevent mixing camera and robot coordinates.

## w4-s9 — Demonstration: inspect TF and look up a transform

- Source: [ROS 2 Humble tf2 Buffer source](https://raw.githubusercontent.com/ros2/geometry2/humble/tf2_ros_py/tf2_ros/buffer.py)
- Joined to: Week 4 demo pp22–23
- Added: Confirmed target/source order and zero-time latest lookup; used this to identify the supplied listener’s inverted intended transform.

## w5-s3 — Sobel, Canny and thin edges

- Source: [OpenCV Canny tutorial](https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html)
- Joined to: Week 5 lecture pp17–20
- Added: Completed the lecture’s abbreviated Canny explanation with two-threshold connectivity and an explicit smoothing example.

## w5-s4 — Classical detection: features, HoG, SVM, SIFT and BRIEF

- Source: [OpenCV BRIEF tutorial](https://docs.opencv.org/4.x/dc/d7d/tutorial_py_brief.html)
- Joined to: Week 5 lecture p27
- Added: Checked that BRIEF describes patches rather than finding keypoints and clarified the slide’s inconsistent invariance/comparison wording.

## w5-s5 — Deep detection, YOLO and robustness

- Source: [Fast R-CNN original paper](https://arxiv.org/abs/1504.08083)
- Joined to: Week 5 lecture p29
- Added: Checked the region-based method so RoI pooling is not mistaken for proposal generation.

## w5-s5 — Deep detection, YOLO and robustness

- Source: [Faster R-CNN original paper](https://arxiv.org/abs/1506.01497)
- Joined to: Week 5 lecture p29
- Added: Verified the learned proposal network, shared features and 2015 first-submission date.

## w5-s5 — Deep detection, YOLO and robustness

- Source: [Original YOLO paper](https://arxiv.org/abs/1506.02640)
- Joined to: Week 5 lecture pp30–32
- Added: Verified whole-image box/class prediction and the preprint/conference date distinction.

## w5-s8 — Demonstration: camera messages and calibration information

- Source: [ROS 2 Humble Image message](https://raw.githubusercontent.com/ros2/common_interfaces/humble/sensor_msgs/msg/Image.msg)
- Joined to: Week 5 demo p3
- Added: Verified acquisition header, image dimensions, encoding and full-row byte step so the slide’s message screenshot is understandable.

## w5-s8 — Demonstration: camera messages and calibration information

- Source: [ROS 2 Humble CameraInfo message](https://raw.githubusercontent.com/ros2/common_interfaces/humble/sensor_msgs/msg/CameraInfo.msg)
- Joined to: Week 5 demo p3
- Added: Added an optional numerical meaning of intrinsics and pixel projection; this shows why Image alone does not provide 3D location.

## w5-s10 — Demonstration: CvBridge between ROS and OpenCV

- Source: [ROS 2 Humble CvBridge source](https://github.com/ros-perception/vision_opencv/blob/humble/cv_bridge/python/cv_bridge/core.py)
- Joined to: Week 5 demo pp10–11
- Added: Verified passthrough preserves pixel encoding while explicit bgr8 asks for BGR conversion.

## w5-s10 — Demonstration: CvBridge between ROS and OpenCV

- Source: [Lecturer Workshop 5: robot perception and vision](https://github.com/kivrakh/KV6022_limo_ros2/wiki/Workshop-5-%E2%80%90-Robot-Perception-and-Vision)
- Joined to: Week 5 demonstration pp10–14; optional practical context
- Added: Checked the original workshop camera/CvBridge tasks and its colour-contour exercise. Added the primary-source practice link; its ROS 1 documentation and newer detector dependencies require version checks.

## w5-s11 — Demonstration: RGB, HSV, colour masks and contours

- Source: [OpenCV inRange tutorial](https://docs.opencv.org/4.x/da/d97/tutorial_threshold_inRange.html)
- Joined to: Week 5 demo pp12–13
- Added: Verified HSV channel meaning and half-degree hue scaling to avoid copying unsuitable colour-picker limits.

## w5-s11 — Demonstration: RGB, HSV, colour masks and contours

- Source: [OpenCV contours tutorial](https://docs.opencv.org/4.x/d4/d73/tutorial_py_contours_begin.html)
- Joined to: Week 5 demo p14
- Added: Verified binary-mask contour input, two-result API, list wrapping for drawing one contour and point compression.

## w7-s8 — Demonstration: smoothing odometry with robot_localization

- Source: [robot_localization Humble configuration](https://github.com/cra-ros-pkg/robot_localization/blob/humble-devel/doc/configuring_robot_localization.rst)
- Joined to: Week 7 demonstration pages 3 and 6
- Added: Verified the 15-value mask order, planar two_d_mode, and avoiding duplicate correlated encoder information.

## w8-s9 — Demonstration: ROS 1 slide names versus Humble interfaces

- Source: [Nav2 AMCL Humble implementation](https://raw.githubusercontent.com/ros-navigation/navigation2/humble/nav2_amcl/src/amcl_node.cpp)
- Joined to: Week 8 demonstration pages 4–9
- Added: Verified ROS 2 particle topic/type, global reinitialization service, map subscription, frame alignment and configurable recovery settings; corrected legacy slide names.

## w8-s9 — Demonstration: ROS 1 slide names versus Humble interfaces

- Source: [ROS 2 tf2 TFMessage definition](https://raw.githubusercontent.com/ros2/geometry2/humble/tf2_msgs/msg/TFMessage.msg)
- Joined to: Week 8 demonstration pages 4–5
- Added: Verified the ROS 2 transform message package, replacing the slide’s ROS 1 tf/tfMessage spelling.

## w9-s3 — Occupancy maps are built from many observations

- Source: [ROS 2 Humble OccupancyGrid message](https://docs.ros.org/en/ros2_packages/humble/api/nav_msgs/index.html)
- Joined to: Week 9 lecture pages 12–14
- Added: Clarified that occupancy grids represent occupancy information; practical unknown space differs from confirmed free space.

## w9-s8 — Demonstration: SLAM Toolbox and processing modes

- Source: [SLAM Toolbox Humble README](https://github.com/SteveMacenski/slam_toolbox/blob/humble/README.md)
- Joined to: Week 9 demonstration pages 2–5
- Added: Verified graph-based 2D laser SLAM, processing modes, serialized graph versus map image, required transforms and matching of configured node names.

## w10-s8 — Demonstration: global planner, footprint and costmap

- Source: [Nav2 Costmap 2D configuration](https://docs.nav2.org/rolling/configuration_and_development/configuration_guide/core_servers/costmap_2d/)
- Joined to: Week 10 demonstration pages 3–6
- Added: Clarified layered global/local costmaps, robot footprint/radius, resolution and inflation costs. Current documentation is used only for these shared concepts.

## w10-s9 — Demonstration: local controller and rolling surroundings

- Source: [Nav2 DWB Controller documentation](https://docs.nav2.org/jazzy/configuration_and_development/configuration_guide/controller_plugins/dwb_controller/)
- Joined to: Week 10 lecture pages 15–18 and demonstration page 5
- Added: Verified trajectory-critic role and the explicit Humble singular progress_checker_plugin note; avoided newer schema changes.

## w11-s8 — RRT: grow a tree by testing sampled connections

- Source: [OMPL RRT reference](https://ompl.kavrakilab.org/classompl_1_1geometric_1_1RRT.html)
- Joined to: Week 11 lecture pages 29–31
- Added: Verified random-target, nearest-node, bounded-extension and goal-bias roles in the RRT lecture pseudocode.

## w11-s8 — RRT: grow a tree by testing sampled connections

- Source: [LaValle Planning Algorithms, chapter 5](https://lavalle.pl/planning/ch5.pdf)
- Joined to: Week 11 lecture pages 28–31
- Added: Clarified sampling-based feasibility and asymptotic completeness assumptions rather than finite-run or shortest-path guarantees.

## w11-s11 — Demonstration: send goals, read feedback, check the result

- Source: [Nav2 Simple Commander Humble source](https://raw.githubusercontent.com/ros-navigation/navigation2/humble/nav2_simple_commander/nav2_simple_commander/robot_navigator.py)
- Joined to: Week 11 demonstration pages 3–5
- Added: Verified completion includes failure/cancelation; getResult distinguishes outcomes. Confirmed Humble methods and readiness flow instead of newer API additions.

## w11-s11 — Demonstration: send goals, read feedback, check the result

- Source: [Nav2 Simple Commander current documentation](https://docs.nav2.org/rolling/configuration_and_development/simple_commander_api/simple_commander_api/)
- Joined to: Week 11 demonstration pages 3–5
- Added: Checked request/poll/result usage and explicit cancelation when changing task type. Newer signatures were not imported into Humble examples.

## w11-s11 — Demonstration: send goals, read feedback, check the result

- Source: [Nav2 NavigateToPose Humble action definition](https://raw.githubusercontent.com/ros-navigation/navigation2/humble/nav2_msgs/action/NavigateToPose.action)
- Joined to: Week 11 demonstration pages 4–5
- Added: Verified navigation_time is a duration message; corrected the slide snippet’s navigation_duration numeric comparison.
