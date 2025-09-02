// Plain JS / jQuery implementation for registration & display
$(function () {
  // Check if API service is available
  if (!window.apiService) {
    console.error('API Service not found! Make sure api.js is loaded before app.js');
    return;
  }
  // Debug logging disabled in UI; use toast popups only
  function debugLog() { /* no-op to suppress debug panel output */ }

  function showToast(message, type = 'info', timeout = 2800) {
    const $t = $('#toast');
    var text = message;
    if (typeof message === 'object' && message !== null) {
      text = message.message || message.error || 'An error occurred';
    }
    $t.removeClass('toast--success toast--error').addClass('toast--show');
    if (type === 'success') $t.addClass('toast--success');
    else if (type === 'error') $t.addClass('toast--error');
    $t.text(text);
    setTimeout(() => $t.removeClass('toast--show'), timeout);
  }

  function validateField(name, value) {
    switch (name) {
      case 'username':
        if (!value || !value.trim()) return 'Username is required';
          // allow 4-20 chars, start with a letter, alphanumeric
          if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(value)) {
            return 'Username must be 4-20 characters, start with a letter, and contain only letters and numbers';
          }
        return '';

      // We collect firstName + lastName and validate them separately
      case 'firstName':
      case 'lastName':
        if (!value || !value.trim()) return (name === 'firstName' ? 'First name is required' : 'Last name is required');
        if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
          return 'Name should only contain letters and spaces (2-50 characters)';
        }
        return '';

      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'mobile':
        if (!value || !value.trim()) return 'Mobile number is required';
        if (!/^\d{10}$/.test(value)) {
          return 'Mobile number must be exactly 10 digits';
        }
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character (!@#$%^&*)';
        return '';

      default:
        return '';
    }
  }

  function collectFormData($form) {
    // read raw form values then build payload expected by backend
    const raw = {};
    $form.serializeArray().forEach(item => { raw[item.name] = item.value; });

    // backend expects: username, email, password, fullName, phone
    const payload = {
      username: raw.username || '',
      email: raw.email || '',
      password: raw.password || '',
      fullName: ((raw.firstName || '').trim() + ' ' + (raw.lastName || '').trim()).trim(),
      phone: raw.mobile || raw.phone || ''
    };

    return { raw, payload };
  }

  function clearErrors($form) {
    $form.find('.error').text('');
  }

  function showErrors(errs) {
    Object.keys(errs).forEach(k => {
      // errs keys may be for payload (fullName/phone) or raw form keys (firstName/lastName/mobile)
      $(`.error[data-for="${k}"]`).text(errs[k]);
    });
  }

  async function saveUser(data) {
    try {
      const result = await apiService.register(data);
  // keep debug label only to avoid printing large user objects
  debugLog('saved user');
      return result;
    } catch (err) {
  // avoid dumping full error object to console
  console.error('saveUser: failed to save user');
  showToast('Failed to save registration', 'error');
  debugLog('save error');
      throw err;
    }
  }

  // Registration page behavior
  if ($('#registrationForm').length) {
    const $form = $('#registrationForm');

    $form.on('submit', async function (e) {
      e.preventDefault();
      clearErrors($form);
      const { raw, payload } = collectFormData($form);
      const errs = {};

      // validate raw fields that exist on the form
      ['firstName', 'lastName', 'mobile', 'username', 'email', 'password'].forEach(k => {
        const value = raw[k] || '';
        const err = validateField(k, value);
        if (err) errs[k] = err;
      });

      // ensure fullName (constructed) is present
      if (!payload.fullName) errs['firstName'] = 'Full name is required';

  // brief submit marker
  debugLog('registration submit');

      if (Object.keys(errs).length) {
        showErrors(errs);
  showToast('Please fix the validation errors', 'error');
        return;
      }

      $('#saveBtn').prop('disabled', true).text('Saving...');
      
      try {
        const resp = await apiService.register(payload);
        // success - clear form error and show toast
        $('#formError').addClass('hidden').text('');
        showToast('Registration Successful!', 'success');
        $form[0].reset();
        setTimeout(() => { window.location = 'display.html'; }, 1000);
      } catch (error) {
        // show server provided message if available
        var msg = (error && error.message) || 'Registration failed';
        $('#formError').removeClass('hidden').text(msg);
        showToast(msg, 'error');
        debugLog('Registration error');
      } finally {
        $('#saveBtn').prop('disabled', false).text('Save Registration');
      }
    });
  }

  // Login page behavior
  if ($('#loginForm').length) {
    const $form = $('#loginForm');

    $form.on('submit', async function (e) {
      e.preventDefault();
      $form.find('.error').text('');
      const data = {};
      $form.serializeArray().forEach(item => { data[item.name] = item.value; });

      if (!data.email || !data.password) {
        if (!data.email) $(`.error[data-for="email"]`).text('Email is required');
        if (!data.password) $(`.error[data-for="password"]`).text('Password is required');
  showToast('Please fix the validation errors', 'error');
        return;
      }

      $('#loginBtn').prop('disabled', true).text('Signing in...');
      try {
        await apiService.login({ email: data.email, password: data.password });
  $('#loginError').addClass('hidden').text('');
  showToast('Login successful', 'success');
        setTimeout(() => { window.location = 'display.html'; }, 500);
      } catch (err) {
  var msg = (err && err.message) || 'Login failed';
  $('#loginError').removeClass('hidden').text(msg);
  showToast(msg, 'error');
        debugLog('Login error');
      } finally {
        $('#loginBtn').prop('disabled', false).text('Login');
      }
    });
  }

  // Display page behavior
  if ($('#usersGrid').length) {
  const $tbody = $('#usersTbody');
  const $usersGrid = $('#usersGrid');
  const $tableWrap = $('#tableWrap');
  const $empty = $('#emptyState');
  const $total = $('#totalCount');

    function formatDate(s) { return new Date(s).toLocaleString(); }

    async function render() {
      try {
  // brief fetch marker
  debugLog('Fetching users');
        const result = await window.apiService.getAllUsers();
        const users = result.data.users;
  debugLog('Rendered users count=' + users.length);
        $usersGrid.empty();
        $total.text(users.length);

        if (!users.length) {
          $tableWrap.hide();
          $empty.show();
          return;
        }

        $empty.hide();
        $tableWrap.show();

        // Create animated user cards
        users.forEach((u, i) => {
          const initials = (u.fullName || u.username || 'U').split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase();
          const card = $(
            `<div class="user-card" data-id="${u._id || u.id || ''}">
              <div class="user-meta">
                <div class="avatar">${initials}</div>
                <div>
                  <div class="user-name">${u.fullName || u.username}</div>
                  <div class="user-role">@${u.username}</div>
                </div>
              </div>
              <div class="mt-3 user-contact">
                <div class="text-sm">${u.email || ''}</div>
                <div class="text-sm text-slate-500">${u.phone || ''}</div>
              </div>
              <div class="mt-4 flex items-center justify-between text-sm text-slate-500">
                <div>Joined: ${formatDate(u.createdAt)}</div>
                <div>${u.lastLogin ? `Last: ${formatDate(u.lastLogin)}` : 'Never'}</div>
              </div>
            </div>`
          );

          // append hidden and then stagger enter class for animation
          $usersGrid.append(card);
          setTimeout(() => { card.addClass('enter'); }, 80 * i);
        });
      } catch (error) {
  showToast(error.message || 'Failed to load users', 'error');
  debugLog('render error');
      }
    }

    $(document).on('click', '.deleteBtn', function () {
      const id = $(this).data('id');
      let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      users = users.filter(u => u.id !== id);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
  showToast('User Deleted', 'success');
      render();
    });

  $('#refreshBtn').on('click', function () { render(); showToast('Refreshed', 'info'); });
    // initial render with simulated delay
    setTimeout(render, 400);
  }
});
