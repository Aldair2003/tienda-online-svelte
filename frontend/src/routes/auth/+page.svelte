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
    if (!loginForm.email || !loginForm.password) {
      notificaciones.agregar('error', 'Todos los campos son obligatorios');
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
      if (usuario.rol === 'vendedor') {
        goto('/admin');
      } else {
        goto('/');
      }
    } catch (error: any) {
      notificaciones.agregar('error', error.message || 'Error al iniciar sesión');
    } finally {
      cargando = false;
    }
  }

  async function handleRegistro() {
    if (!registroForm.nombre || !registroForm.email || !registroForm.password || !registroForm.confirmarPassword) {
      notificaciones.agregar('error', 'Todos los campos son obligatorios');
      return;
    }

    if (registroForm.password !== registroForm.confirmarPassword) {
      notificaciones.agregar('error', 'Las contraseñas no coinciden');
      return;
    }

    if (registroForm.password.length < 6) {
      notificaciones.agregar('error', 'La contraseña debe tener al menos 6 caracteres');
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
      notificaciones.agregar('success', '¡Registro exitoso! Bienvenido');
      
      // Redirigir según el rol
      if (usuario.rol === 'vendedor') {
        goto('/admin');
      } else {
        goto('/');
      }
    } catch (error: any) {
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
  <div class="w-full max-w-md">
    <!-- Logo/Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
        <Store class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi Tienda</h1>
      <p class="text-gray-600">Tu marketplace favorito</p>
    </div>

    <!-- Card Principal -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button
          on:click={() => cambiarModo('login')}
          class="flex-1 py-4 font-semibold transition-all {modo === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}"
        >
          Iniciar Sesión
        </button>
        <button
          on:click={() => cambiarModo('registro')}
          class="flex-1 py-4 font-semibold transition-all {modo === 'registro' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}"
        >
          Registrarse
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
              class="w-full btn btn-primary py-3 text-lg shadow-lg hover:shadow-xl"
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
              class="w-full btn btn-primary py-3 text-lg shadow-lg hover:shadow-xl"
            >
              {#if cargando}
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Registrando...</span>
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
</style>

