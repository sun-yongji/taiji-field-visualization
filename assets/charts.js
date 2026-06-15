/**
 * 太极场理论 · 交互式可视化 - 图表逻辑
 * 使用 ECharts 构建六大可视化模块
 */
;(function () {
  'use strict';

  /* ============================
   * 全局配色 & 工具函数
   * ============================ */
  var COLORS = {
    yang:      '#ff4444',  // 阳 - 红
    yin:       '#4488ff',  // 阴 - 蓝
    gold:      '#ffd700',  // 金色高亮
    cyan:      '#00e5ff',  // 青色
    green:     '#00e676',  // 绿
    purple:    '#b388ff',  // 紫
    orange:    '#ff9100',  // 橙
    pink:      '#ff4081',  // 粉
    white:     '#ffffff',
    gray:      '#888888',
    darkBg:    '#0a0e27',
    cardBg:    '#111633',
    border:    '#1e2a5a'
  };

  /** 获取 CSS 变量值 */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /** 初始化 ECharts 实例 */
  function initChart(domId) {
    var dom = document.getElementById(domId);
    if (!dom) return null;
    var chart = echarts.init(dom, 'dark');
    return chart;
  }

  /** 存储所有图表实例以便 resize */
  var allCharts = [];

  function registerChart(chart) {
    if (chart) allCharts.push(chart);
    return chart;
  }

  /* ============================
   * 模块1：双鱼眼能量场（世界地图散点图）
   * ============================ */
  function renderDualEyeEnergyField() {
    var chart = initChart('chart-dual-eye');
    if (!chart) return;
    registerChart(chart);

    // S形曲线控制点（从昆仑到百慕大）
    var sCurveCoords = [];
    for (var t = 0; t <= 1; t += 0.02) {
      var lon = 80 + t * (-71 - 80); // 80 -> -71
      var lat = 36 + t * (25 - 36);  // 36 -> 25
      // 添加S形偏移
      var sOffset = 15 * Math.sin(t * Math.PI * 2);
      lat += sOffset;
      sCurveCoords.push([lon, lat]);
    }

    // 巳亥能量主轴标注点
    var axisLine = [];
    for (var a = 0; a <= 360; a += 5) {
      axisLine.push([a, 0]);
    }

    chart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '双鱼眼能量场',
        subtext: '昆仑阳眼 ↔ 百慕大阴眼',
        left: 'center',
        top: 10,
        textStyle: { color: COLORS.gold, fontSize: 22, fontWeight: 'bold' },
        subtextStyle: { color: COLORS.cyan, fontSize: 14 }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (params.seriesType === 'scatter') {
            return params.name + '<br/>S系数: ' + params.value[2] + '<br/>能量占比: ' + params.value[3] + '%';
          }
          return params.name;
        }
      },
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.5,
        center: [10, 30],
        label: { show: false },
        itemStyle: {
          areaColor: '#0d1b3e',
          borderColor: '#1a3a6a',
          borderWidth: 0.8
        },
        emphasis: {
          itemStyle: { areaColor: '#1a2a5a' },
          label: { show: false }
        },
        silent: true
      },
      series: [
        // 昆仑阳眼
        {
          name: '昆仑（阳眼）',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: 28,
          data: [{ name: '昆仑（阳眼）', value: [80, 36, 1.15, 25] }],
          itemStyle: {
            color: COLORS.yang,
            shadowBlur: 20,
            shadowColor: COLORS.yang
          },
          label: {
            show: true,
            formatter: '阳眼\n昆仑 S=1.15',
            position: 'top',
            color: COLORS.yang,
            fontSize: 14,
            fontWeight: 'bold',
            distance: 15
          },
          zlevel: 10
        },
        // 百慕大阴眼
        {
          name: '百慕大（阴眼）',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: 24,
          data: [{ name: '百慕大（阴眼）', value: [-71, 25, 0.853, 20] }],
          itemStyle: {
            color: COLORS.yin,
            shadowBlur: 20,
            shadowColor: COLORS.yin
          },
          label: {
            show: true,
            formatter: '阴眼\n百慕大 S=0.853',
            position: 'bottom',
            color: COLORS.yin,
            fontSize: 14,
            fontWeight: 'bold',
            distance: 15
          },
          zlevel: 10
        },
        // S形能量通道
        {
          name: '能量通道',
          type: 'lines',
          coordinateSystem: 'geo',
          polyline: true,
          lineStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: COLORS.yang },
                { offset: 0.5, color: COLORS.purple },
                { offset: 1, color: COLORS.yin }
              ]
            },
            width: 3,
            curveness: 0.4,
            opacity: 0.8
          },
          effect: {
            show: true,
            period: 6,
            trailLength: 0.4,
            symbol: 'circle',
            symbolSize: 6,
            color: COLORS.gold
          },
          data: [{ coords: sCurveCoords }],
          zlevel: 5
        },
        // 能量分配散点
        {
          name: '能量分配',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbolSize: function (val) {
            return Math.max(8, val[3] * 1.2);
          },
          rippleEffect: { brushType: 'stroke', scale: 3 },
          data: [
            { name: '地核能量', value: [0, 0, 0, 25] },
            { name: '海洋能量', value: [170, -20, 0, 30] }
          ],
          itemStyle: { color: COLORS.gold },
          label: {
            show: true,
            formatter: function (p) { return p.name + ' ' + p.value[3] + '%'; },
            color: COLORS.gold,
            fontSize: 12
          },
          zlevel: 8
        },
        // 巳亥轴标注线
        {
          name: '巳亥能量主轴',
          type: 'lines',
          coordinateSystem: 'geo',
          lineStyle: {
            color: COLORS.gold,
            width: 1.5,
            type: 'dashed',
            opacity: 0.6
          },
          data: [
            {
              coords: [
                [80 + 90 * Math.cos(163 * Math.PI / 180), 36 + 90 * Math.sin(163 * Math.PI / 180)],
                [80 - 90 * Math.cos(163 * Math.PI / 180), 36 - 90 * Math.sin(163 * Math.PI / 180)]
              ]
            }
          ],
          zlevel: 3
        }
      ]
    });
  }

  /* ============================
   * 模块2：太极图三维结构（Canvas绘图）
   * ============================ */
  function renderTaijiStructure() {
    var canvas = document.getElementById('canvas-taiji');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, cx, cy, R;
    var angle = 0;
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width * (window.devicePixelRatio || 1);
      H = canvas.height = Math.min(rect.width * 0.7, 500) * (window.devicePixelRatio || 1);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = Math.min(rect.width * 0.7, 500) + 'px';
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.32;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // 外圈光晕
      var glow = ctx.createRadialGradient(0, 0, R * 0.9, 0, 0, R * 1.3);
      glow.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
      glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 阳鱼（红色半圆）
      ctx.beginPath();
      ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
      ctx.arc(0, R / 2, R / 2, Math.PI / 2, -Math.PI / 2, false);
      ctx.closePath();
      ctx.fillStyle = COLORS.yang;
      ctx.fill();

      // 阴鱼（蓝色半圆）
      ctx.beginPath();
      ctx.arc(0, 0, R, Math.PI / 2, -Math.PI / 2, false);
      ctx.arc(0, -R / 2, R / 2, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();
      ctx.fillStyle = COLORS.yin;
      ctx.fill();

      // 阳鱼中的阴眼
      ctx.beginPath();
      ctx.arc(0, R / 2, R * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.yin;
      ctx.fill();

      // 阴鱼中的阳眼
      ctx.beginPath();
      ctx.arc(0, -R / 2, R * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.yang;
      ctx.fill();

      // 中心太极点（地核）
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.gold;
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.gold;

      // 外圈边框
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();

      // 标注文字（不随旋转）
      var fontSize = Math.max(14, R * 0.12);
      ctx.font = 'bold ' + fontSize + 'px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';

      // 昆仑阳眼标注
      ctx.fillStyle = COLORS.yang;
      ctx.fillText('昆仑阳眼', cx + R * 1.35, cy - R * 0.3);
      ctx.font = (fontSize * 0.8) + 'px "Microsoft YaHei", sans-serif';
      ctx.fillText('S = 1.15', cx + R * 1.35, cy - R * 0.3 + fontSize);

      // 百慕大阴眼标注
      ctx.font = 'bold ' + fontSize + 'px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = COLORS.yin;
      ctx.fillText('百慕大阴眼', cx - R * 1.35, cy + R * 0.3);
      ctx.font = (fontSize * 0.8) + 'px "Microsoft YaHei", sans-serif';
      ctx.fillText('S = 0.853', cx - R * 1.35, cy + R * 0.3 + fontSize);

      // 地核标注
      ctx.font = 'bold ' + (fontSize * 0.9) + 'px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = COLORS.gold;
      ctx.fillText('太极点（地核）', cx, cy + R * 1.2);

      // S形阴阳分界线标注
      ctx.fillStyle = COLORS.purple;
      ctx.font = (fontSize * 0.75) + 'px "Microsoft YaHei", sans-serif';
      ctx.fillText('S形阴阳分界线', cx, cy - R * 1.15);

      // 能量分配
      ctx.font = (fontSize * 0.7) + 'px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = COLORS.gray;
      ctx.fillText('能量分配: 昆仑25% | 海洋30% | 百慕大20% | 地核25%', cx, H - 15);

      angle += 0.005;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', function () {
      resize();
    });

    // 存储清理函数
    return function () {
      cancelAnimationFrame(animId);
    };
  }

  /* ============================
   * 模块3：七政四余十四重天体干涉网系（环形图）
   * ============================ */
  function renderFourteenLayers() {
    var chart = initChart('chart-fourteen');
    if (!chart) return;
    registerChart(chart);

    var data = [
      { value: 40,    name: 'S1 天网',    itemStyle: { color: COLORS.gold } },
      { value: 25,    name: 'S2 日网',    itemStyle: { color: COLORS.orange } },
      { value: 11.8,  name: 'S3 月网',    itemStyle: { color: COLORS.cyan } },
      { value: 1.46,  name: 'S4 木星网',  itemStyle: { color: '#ff6b35' } },
      { value: 1.99,  name: 'S5 土星网',  itemStyle: { color: '#daa520' } },
      { value: 0.93,  name: 'S6 水星网',  itemStyle: { color: '#a0a0a0' } },
      { value: 1.72,  name: 'S7 金星网',  itemStyle: { color: '#ffe4b5' } },
      { value: 1.19,  name: 'S8 火星网',  itemStyle: { color: '#cd5c5c' } },
      { value: 3.98,  name: 'S9 雷网',    itemStyle: { color: '#9370db' } },
      { value: 2.46,  name: 'S10 风网',   itemStyle: { color: '#87ceeb' } },
      { value: 1.52,  name: 'S11 雨网',   itemStyle: { color: '#4682b4' } },
      { value: 0.94,  name: 'S12 电网',   itemStyle: { color: '#00ced1' } },
      { value: 6.44,  name: 'S13 地网',   itemStyle: { color: '#8b4513' } },
      { value: 0.58,  name: 'S14 人网',   itemStyle: { color: '#ff69b4' } }
    ];

    chart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '七政四余十四重天体干涉网系',
        subtext: '能量分配占比',
        left: 'center',
        top: 10,
        textStyle: { color: COLORS.gold, fontSize: 20, fontWeight: 'bold' },
        subtextStyle: { color: COLORS.cyan, fontSize: 13 }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 20,
        top: 80,
        bottom: 20,
        textStyle: { color: '#ccc', fontSize: 13 },
        pageTextStyle: { color: '#ccc' }
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '太极点',
            fill: COLORS.gold,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Microsoft YaHei'
          },
          z: 100
        }
      ],
      series: [
        {
          name: '干涉网系',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['40%', '55%'],
          roseType: false,
          label: {
            show: true,
            formatter: '{b}\n{c}%',
            color: '#ddd',
            fontSize: 11
          },
          labelLine: { lineStyle: { color: '#555' } },
          itemStyle: {
            borderRadius: 4,
            borderColor: '#0a0e27',
            borderWidth: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(255, 215, 0, 0.5)'
            },
            label: { fontSize: 14, fontWeight: 'bold' }
          },
          data: data,
          animationType: 'scale',
          animationEasing: 'elasticOut'
        }
      ]
    });
  }

  /* ============================
   * 模块4：地磁全域方程 B(R) 曲线（折线图）
   * ============================ */
  function renderMagneticField() {
    var chart = initChart('chart-magnetic');
    if (!chart) return;
    registerChart(chart);

    var C_taiji = 121.35;
    var R_surface = 6371;

    // 生成太极场模型数据
    var taijiData = [];
    var dipoleData = [];
    var igrfData = [];

    for (var r = 0; r <= 40000; r += 200) {
      var R = Math.max(r, 100); // 避免除零
      var alpha;
      if (R <= 1221) alpha = 1.08;       // 地核
      else if (R <= 3480) alpha = 1.35;   // 地幔
      else alpha = 1.82;                   // 岩石圈及以上

      var B_taiji = C_taiji * Math.pow(R_surface / R, alpha);
      var B_dipole = C_taiji * Math.pow(R_surface / R, 3);

      taijiData.push([r, Math.round(B_taiji * 100) / 100]);
      dipoleData.push([r, Math.round(B_dipole * 100) / 100]);
    }

    // IGRF参考值（关键点）
    igrfData = [
      [0, 250000],
      [1221, 85000],
      [3480, 25000],
      [6371, 45000],
      [10000, 12000],
      [20000, 1500],
      [35786, 100],
      [40000, 60]
    ];

    // 标注线
    var markLines = {
      silent: true,
      lineStyle: { type: 'dashed', width: 1 },
      label: { fontSize: 13, color: COLORS.gold },
      data: [
        { xAxis: 1221, label: { formatter: '地核\n1221km' } },
        { xAxis: 3480, label: { formatter: '地幔\n3480km' } },
        { xAxis: 6371, label: { formatter: '地表\n6371km' } },
        { xAxis: 35786, label: { formatter: 'GEO\n35786km' } }
      ]
    };

    chart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '地磁全域方程 B(R) 曲线',
        subtext: '太极场模型 vs 标准偶极子 vs IGRF参考',
        left: 'center',
        top: 10,
        textStyle: { color: COLORS.gold, fontSize: 20, fontWeight: 'bold' },
        subtextStyle: { color: COLORS.cyan, fontSize: 13 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          var s = '距离R: ' + params[0].value[0] + ' km<br/>';
          params.forEach(function (p) {
            s += p.marker + p.seriesName + ': ' + p.value[1] + ' nT<br/>';
          });
          return s;
        }
      },
      legend: {
        data: ['太极场模型 B(R)=C/R^α', '标准偶极子 B=C/R³', 'IGRF参考值'],
        top: 65,
        textStyle: { color: '#ccc', fontSize: 13 }
      },
      grid: {
        left: 80,
        right: 40,
        top: 110,
        bottom: 60
      },
      xAxis: {
        type: 'value',
        name: '距离 R (km)',
        nameTextStyle: { color: '#aaa', fontSize: 14 },
        axisLine: { lineStyle: { color: '#444' } },
        axisLabel: { color: '#aaa', fontSize: 12 },
        splitLine: { lineStyle: { color: '#1a2040' } }
      },
      yAxis: {
        type: 'log',
        name: '磁场强度 B (nT)',
        nameTextStyle: { color: '#aaa', fontSize: 14 },
        axisLine: { lineStyle: { color: '#444' } },
        axisLabel: { color: '#aaa', fontSize: 12 },
        splitLine: { lineStyle: { color: '#1a2040' } },
        min: 10,
        max: 1000000
      },
      dataZoom: [
        { type: 'slider', xAxisIndex: 0, bottom: 10, height: 25, borderColor: '#333', fillerColor: 'rgba(0,229,255,0.1)' },
        { type: 'inside', xAxisIndex: 0 }
      ],
      series: [
        {
          name: '太极场模型 B(R)=C/R^α',
          type: 'line',
          data: taijiData,
          smooth: true,
          lineStyle: { color: COLORS.gold, width: 3 },
          itemStyle: { color: COLORS.gold },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
                { offset: 1, color: 'rgba(255, 215, 0, 0)' }
              ]
            }
          },
          markLine: markLines,
          z: 3
        },
        {
          name: '标准偶极子 B=C/R³',
          type: 'line',
          data: dipoleData,
          smooth: true,
          lineStyle: { color: COLORS.yin, width: 2, type: 'dashed' },
          itemStyle: { color: COLORS.yin },
          z: 2
        },
        {
          name: 'IGRF参考值',
          type: 'scatter',
          data: igrfData,
          symbol: 'diamond',
          symbolSize: 12,
          itemStyle: { color: COLORS.green, borderColor: '#fff', borderWidth: 1 },
          z: 4
        }
      ]
    });
  }

  /* ============================
   * 模块5：巳亥能量主轴与384爻分布（极坐标图）
   * ============================ */
  function renderHexagramPolar() {
    var chart = initChart('chart-hexagram');
    if (!chart) return;
    registerChart(chart);

    // 64卦在360度上的能量分布
    var hexData = [];
    var peakHexData = [];
    var galaxyZone = [];

    for (var i = 0; i < 360; i += 5) {
      // 基础能量分布
      var base = 0.5 + 0.3 * Math.sin(i * Math.PI / 180);

      // 巳方163度能量峰值
      var siPeak = 1.34 * Math.exp(-Math.pow(i - 163, 2) / (2 * 400));

      // 亥方343度
      var haiPeak = 0.9 * Math.exp(-Math.pow(i - 343, 2) / (2 * 400));

      // C6六重对称
      var c6 = 0.15 * Math.cos(6 * i * Math.PI / 180);

      var energy = base + siPeak + haiPeak + c6;
      hexData.push([i, Math.round(energy * 100) / 100]);

      // 银河优势区 150-195度
      if (i >= 150 && i <= 195) {
        galaxyZone.push([i, energy]);
      }
    }

    // C6对称标注
    var c6Angles = [0, 60, 120, 180, 240, 300];
    var c6MarkPoints = c6Angles.map(function (a) {
      return { coord: [a, 0.5], name: 'C6-' + a + '°' };
    });

    chart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '巳亥能量主轴与384爻分布',
        subtext: '64卦能量极坐标 · C6六重对称',
        left: 'center',
        top: 10,
        textStyle: { color: COLORS.gold, fontSize: 20, fontWeight: 'bold' },
        subtextStyle: { color: COLORS.cyan, fontSize: 13 }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          return '角度: ' + p.value[0] + '°<br/>能量: ' + p.value[1];
        }
      },
      angleAxis: {
        type: 'value',
        min: 0,
        max: 360,
        startAngle: 90,
        splitLine: { lineStyle: { color: '#1a2040' } },
        axisLine: { lineStyle: { color: '#333' } },
        axisLabel: {
          color: '#aaa',
          fontSize: 11,
          formatter: function (v) { return v + '°'; }
        }
      },
      radiusAxis: {
        min: 0,
        max: 2,
        splitLine: { lineStyle: { color: '#1a2040' } },
        axisLabel: { color: '#aaa', fontSize: 11 }
      },
      polar: {
        center: ['50%', '55%'],
        radius: '65%'
      },
      graphic: [
        // 巳方标注
        {
          type: 'text',
          left: '65%',
          top: '22%',
          style: {
            text: '巳方 163°',
            fill: COLORS.yang,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        {
          type: 'text',
          left: '65%',
          top: '26%',
          style: {
            text: '峰值 1.34',
            fill: COLORS.yang,
            fontSize: 12
          }
        },
        // 亥方标注
        {
          type: 'text',
          left: '30%',
          top: '82%',
          style: {
            text: '亥方 343°',
            fill: COLORS.yin,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        // 乾卦标注
        {
          type: 'text',
          left: '46%',
          top: '12%',
          style: {
            text: '乾 180°',
            fill: COLORS.gold,
            fontSize: 13
          }
        },
        // 坤卦标注
        {
          type: 'text',
          left: '46%',
          top: '88%',
          style: {
            text: '坤 0°',
            fill: COLORS.gold,
            fontSize: 13
          }
        }
      ],
      series: [
        // 银河优势区高亮
        {
          name: '银河优势区',
          type: 'bar',
          coordinateSystem: 'polar',
          data: galaxyZone.map(function (d) {
            return {
              value: [d[0], d[1]],
              itemStyle: {
                color: 'rgba(255, 215, 0, 0.5)',
                borderColor: COLORS.gold,
                borderWidth: 1
              }
            };
          }),
          barWidth: 6,
          z: 1
        },
        // 64卦能量分布
        {
          name: '卦爻能量',
          type: 'line',
          coordinateSystem: 'polar',
          data: hexData,
          smooth: true,
          lineStyle: { color: COLORS.cyan, width: 2 },
          itemStyle: { color: COLORS.cyan },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 229, 255, 0.4)' },
                { offset: 1, color: 'rgba(0, 229, 255, 0)' }
              ]
            }
          },
          z: 2
        },
        // C6对称点
        {
          name: 'C6对称',
          type: 'scatter',
          coordinateSystem: 'polar',
          data: c6Angles.map(function (a) {
            return [a, 0.5];
          }),
          symbol: 'triangle',
          symbolSize: 14,
          itemStyle: { color: COLORS.purple, borderColor: '#fff', borderWidth: 1 },
          z: 5
        },
        // 巳方峰值
        {
          name: '巳方峰值',
          type: 'scatter',
          coordinateSystem: 'polar',
          data: [[163, 1.34]],
          symbol: 'circle',
          symbolSize: 16,
          itemStyle: { color: COLORS.yang, shadowBlur: 15, shadowColor: COLORS.yang },
          z: 6
        },
        // 亥方
        {
          name: '亥方',
          type: 'scatter',
          coordinateSystem: 'polar',
          data: [[343, 0.9]],
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: { color: COLORS.yin, shadowBlur: 15, shadowColor: COLORS.yin },
          z: 6
        }
      ]
    });
  }

  /* ============================
   * 模块6：太极场应用全景（信息卡片 - ECharts 暂不处理，由 HTML/CSS 渲染）
   * ============================ */
  function renderApplicationCards() {
    // 卡片由 HTML 直接渲染，此处仅做动画增强
    var cards = document.querySelectorAll('.app-card');
    cards.forEach(function (card, idx) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(function () {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + idx * 120);
    });
  }

  /* ============================
   * 初始化
   * ============================ */
  function init() {
    // 先加载世界地图数据，再初始化所有模块
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/world.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var worldJson = JSON.parse(xhr.responseText);
          echarts.registerMap('world', worldJson);
          console.log('世界地图注册成功，共 ' + worldJson.features.length + ' 个国家');
        } catch (e) {
          console.error('世界地图解析失败:', e);
        }
      } else {
        console.error('世界地图加载失败，状态码:', xhr.status);
      }
      // 无论地图加载成功与否，都初始化所有模块
      initAllModules();
    };
    xhr.onerror = function () {
      console.error('世界地图请求失败');
      initAllModules();
    };
    xhr.send();
  }

  function initAllModules() {
    // 模块1：双鱼眼能量场
    renderDualEyeEnergyField();

    // 模块2：太极图三维结构
    renderTaijiStructure();

    // 模块3：十四重天体干涉网系
    renderFourteenLayers();

    // 模块4：地磁全域方程
    renderMagneticField();

    // 模块5：巳亥能量主轴
    renderHexagramPolar();

    // 模块6：应用卡片
    renderApplicationCards();

    // 全局 resize
    window.addEventListener('resize', function () {
      allCharts.forEach(function (c) {
        if (c && c.resize) c.resize();
      });
    });
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
