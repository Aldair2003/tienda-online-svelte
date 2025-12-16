<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { notificaciones } from '$lib/stores/notificaciones';
  import { AuthService } from '$lib/services/authService';
  import { LogIn, UserPlus, Mail, Lock, User, Store, ShoppingBag } from 'lucide-svelte';
  
  let modo: 'login' | 'registro' = 'login';
  let cargando = false;

  // Formulario de login
  let loginForm = {
    email: '',
    password: ''
  };

  // Formulario de registro
  let registroForm = {
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    rol: 'cliente' as 'cliente' | 'vendedor'
  };

  async function handleLogin() {
    // Limpiar notificaciones anteriores
    notificaciones.limpiar();

    // Validaciones
    if (!loginForm.email || !loginForm.password) {
      notificaciones.agregar('error', 'Por favor completa todos los campos');
      return;
    }

    if (!loginForm.email.includes('@')) {
      notificaciones.agregar('error', 'Ingresa un correo electrónico válido');
      return;
    }

    try {
      cargando = true;
      const usuario = await AuthService.login({
        email: loginForm.email,
        password: loginForm.password
      });

      auth.login(usuario);
      notificaciones.agregar('success', `¡Bienvenido${usuario.rol === 'cliente' ? '' : ' vendedor'}, ${usuario.nombre}!`);
      
      // Redirigir según el rol
      setTimeout(() => {
        if (usuario.rol === 'vendedor') {
          goto('/admin');
        } else {
          goto('/');
        }
      }, 500);
    } catch (error: any) {
      console.error('Error en login:', error);
      notificaciones.agregar('error', error.message || 'Error al iniciar sesión');
    } finally {
      cargando = false;
    }
  }

  async function handleRegistro() {
    // Limpiar notificaciones anteriores
    notificaciones.limpiar();

    // Validaciones
    if (!registroForm.nombre || !registroForm.email || !registroForm.password || !registroForm.confirmarPassword) {
      notificaciones.agregar('error', 'Por favor completa todos los campos');
      return;
    }

    if (!registroForm.email.includes('@')) {
      notificaciones.agregar('error', 'Ingresa un correo electrónico válido');
      return;
    }

    if (registroForm.password.length < 6) {
      notificaciones.agregar('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (registroForm.password !== registroForm.confirmarPassword) {
      notificaciones.agregar('error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      cargando = true;
      const usuario = await AuthService.registro({
        nombre: registroForm.nombre,
        email: registroForm.email,
        password: registroForm.password,
        rol: registroForm.rol
      });

      // Iniciar sesión automáticamente después del registro
      auth.login(usuario);
      notificaciones.agregar('success', `¡Bienvenido ${usuario.nombre}! Tu cuenta ha sido creada`);
      
      // Redirigir según el rol
      setTimeout(() => {
        if (usuario.rol === 'vendedor') {
          goto('/admin');
        } else {
          goto('/');
        }
      }, 500);
    } catch (error: any) {
      console.error('Error en registro:', error);
      notificaciones.agregar('error', error.message || 'Error en el registro');
    } finally {
      cargando = false;
    }
  }

  function cambiarModo(nuevoModo: 'login' | 'registro') {
    modo = nuevoModo;
  }
</script>

<svelte:head>
  <title>{modo === 'login' ? 'Iniciar Sesión' : 'Registrarse'} - Mi Tienda</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
  <div class="w-full max-w-md animate-fade-in">
    <!-- Logo/Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
        <Store class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">Mi Tienda</h1>
      <p class="text-gray-600 text-lg">Tu marketplace favorito</p>
    </div>

    <!-- Card Principal -->
    <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-gray-100 bg-gray-50/50">
        <button
          on:click={() => cambiarModo('login')}
          class="flex-1 py-4 px-4 font-bold text-base transition-all relative {modo === 'login' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}"
        >
          {#if modo === 'login'}
            <span class="relative z-10">Iniciar Sesión</span>
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-t-lg"></div>
          {:else}
            Iniciar Sesión
          {/if}
        </button>
        <button
          on:click={() => cambiarModo('registro')}
          class="flex-1 py-4 px-4 font-bold text-base transition-all relative {modo === 'registro' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}"
        >
          {#if modo === 'registro'}
            <span class="relative z-10">Registrarse</span>
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-t-lg"></div>
          {:else}
            Registrarse
          {/if}
        </button>
      </div>

      <div class="p-8">
        {#if modo === 'login'}
          <!-- Formulario de Login -->
          <form on:submit|preventDefault={handleLogin} class="space-y-5">
            <div>
              <label for="login-email" class="label">Correo Electrónico</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  bind:value={loginForm.email}
                  class="input pl-11"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label for="login-password" class="label">Contraseña</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  bind:value={loginForm.password}
                  class="input pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              class="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {#if cargando}
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Iniciando sesión...</span>
              {:else}
                <LogIn class="w-5 h-5" />
                <span>Iniciar Sesión</span>
              {/if}
            </button>
          </form>
        {:else}
          <!-- Formulario de Registro -->
          <form on:submit|preventDefault={handleRegistro} class="space-y-5">
            <div>
              <label for="registro-nombre" class="label">Nombre Completo</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="registro-nombre"
                  type="text"
                  bind:value={registroForm.nombre}
                  class="input pl-11"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label for="registro-email" class="label">Correo Electrónico</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="registro-email"
                  type="email"
                  bind:value={registroForm.email}
                  class="input pl-11"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label for="registro-password" class="label">Contraseña</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="registro-password"
                  type="password"
                  bind:value={registroForm.password}
                  class="input pl-11"
                  placeholder="••••••••"
                  minlength="6"
                  required
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label for="confirmar-password" class="label">Confirmar Contraseña</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmar-password"
                  type="password"
                  bind:value={registroForm.confirmarPassword}
                  class="input pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label class="label">Tipo de Cuenta</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  on:click={() => registroForm.rol = 'cliente'}
                  class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all {registroForm.rol === 'cliente' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <ShoppingBag class="w-6 h-6 {registroForm.rol === 'cliente' ? 'text-primary' : 'text-gray-400'}" />
                  <span class="font-medium {registroForm.rol === 'cliente' ? 'text-primary' : 'text-gray-700'}">Cliente</span>
                </button>
                <button
                  type="button"
                  on:click={() => registroForm.rol = 'vendedor'}
                  class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all {registroForm.rol === 'vendedor' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <Store class="w-6 h-6 {registroForm.rol === 'vendedor' ? 'text-primary' : 'text-gray-400'}" />
                  <span class="font-medium {registroForm.rol === 'vendedor' ? 'text-primary' : 'text-gray-700'}">Vendedor</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              class="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {#if cargando}
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creando cuenta...</span>
              {:else}
                <UserPlus class="w-5 h-5" />
                <span>Crear Cuenta</span>
              {/if}
            </button>
          </form>
        {/if}
      </div>
    </div>

    <!-- Link alternativo -->
    <div class="text-center mt-6 text-gray-600">
      {#if modo === 'login'}
        <p>¿No tienes cuenta? <button on:click={() => cambiarModo('registro')} class="text-primary font-semibold hover:underline">Regístrate aquí</button></p>
      {:else}
        <p>¿Ya tienes cuenta? <button on:click={() => cambiarModo('login')} class="text-primary font-semibold hover:underline">Inicia sesión</button></p>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
</style>

