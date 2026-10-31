// Slow liquid-chrome smoke behind Contact. Plain WebGL at low resolution, so it stays cheap:
// a few thousand pixels, 30 frames a second, and nothing at all while off-screen.

const RESOLUTION_SCALE = 0.5;
const MAX_WIDTH = 760;
const FRAME_INTERVAL_MS = 1000 / 30;

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + vec2(11.3, 7.1);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.y;
  float t = time * 0.035;

  // Domain warping: noise that pushes noise around is what makes it read as liquid.
  vec2 q = vec2(fbm(uv * 1.3 + t), fbm(uv * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(uv + 2.6 * q + vec2(1.7, 9.2) + t * 0.6), fbm(uv + 2.6 * q + vec2(8.3, 2.8) - t * 0.4));
  float field = fbm(uv + 2.2 * r);

  // Narrow bright bands on dark, the same falloff as light rolling over polished metal.
  float bands = 0.5 + 0.5 * sin(field * 11.0 + length(q) * 4.0);
  float metal = pow(bands, 5.0) * smoothstep(0.32, 0.72, field);
  float shade = 0.03 + 0.3 * metal + 0.06 * field * field;

  // A little noise hides the banding that dark gradients show on 8-bit screens.
  float dither = (hash(gl_FragCoord.xy + fract(time)) - 0.5) / 255.0;

  gl_FragColor = vec4(vec3(shade + dither), 1.0);
}
`;

function buildProgram(gl) {
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return program;
}

// Compiling can take half a second, and asking for the result too early blocks the page until
// it's done, which would stall scrolling. This waits without asking until the driver has finished.
function whenLinked(gl, program) {
  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  return new Promise((resolve) => {
    const check = () => {
      if (!parallel || gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

export async function startSmoke(canvas, section) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;

  const program = buildProgram(gl);
  await whenLinked(gl, program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, 'resolution');
  const time = gl.getUniformLocation(program, 'time');

  const resize = () => {
    const width = Math.min(MAX_WIDTH, Math.round(section.offsetWidth * RESOLUTION_SCALE));
    const height = Math.round(width * (section.offsetHeight / section.offsetWidth));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(resolution, width, height);
  };
  resize();
  new ResizeObserver(resize).observe(section);

  // A random starting point, so the pattern isn't identical on every visit.
  const offset = Math.random() * 1000;
  let frameId = 0;
  let lastDraw = 0;

  function frame(now) {
    frameId = requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_INTERVAL_MS) return;
    lastDraw = now;
    gl.uniform1f(time, offset + now / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frameId);
    frameId = entry.isIntersecting ? requestAnimationFrame(frame) : 0;
  }).observe(section);

  requestAnimationFrame((now) => {
    frame(now);
    canvas.classList.add('is-live');
  });
}
