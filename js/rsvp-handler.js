/* Custom RSVP Handler for Supabase + Vercel */

document.addEventListener('DOMContentLoaded', function () {
    const rsvpForm = document.getElementById('commentform-253216');
    const commentList = document.getElementById('saic-container-comment-253216');
    const statusDiv = document.getElementById('saic-comment-status-253216');

    // Toggle RSVP form visibility when clicking the "X Ucapan" link
    const toggleLink = document.getElementById('saic-link-253216');
    const wrapComment = document.getElementById('saic-wrap-comment-253216');
    if (toggleLink && wrapComment) {
        toggleLink.addEventListener('click', function (e) {
            e.preventDefault();
            const isHidden = window.getComputedStyle(wrapComment).display === 'none';
            if (isHidden) {
                wrapComment.style.display = 'block';
            } else {
                wrapComment.style.display = 'none';
            }
        });
    }

    // Toggle "Jumlah Tamu" field based on attendance selection
    const attendanceSelect = document.getElementById('attendance');
    const guestWrap = document.querySelector('.saic-wrap-guest');
    const guestSelect = document.getElementById('guest');

    if (attendanceSelect && guestWrap) {
        attendanceSelect.addEventListener('change', function () {
            if (this.value === 'present') {
                guestWrap.style.display = 'block';
                guestSelect.setAttribute('required', 'required');
            } else {
                guestWrap.style.display = 'none';
                guestSelect.removeAttribute('required');
                guestSelect.value = ''; // Reset value
            }
        });
    }

    // Helper function for "Time Ago" formatting
    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds} detik yang lalu`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            const remainingSeconds = seconds % 60;
            return `${minutes} menit, ${remainingSeconds} detik yang lalu`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam yang lalu`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} hari yang lalu`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} bulan yang lalu`;

        const years = Math.floor(months / 12);
        return `${years} tahun yang lalu`;
    }

    // Function to fetch and render messages
    async function loadMessages() {
        try {
            const response = await fetch('/api/rsvp');
            const messages = await response.json();

            if (messages.error) {
                throw new Error(messages.error);
            }

            if (commentList && Array.isArray(messages)) {
                commentList.innerHTML = messages.map(msg => `
                    <li class="saic-comment saic-clearfix" style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; text-align: left; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.05); background: transparent; box-shadow: none; border-radius: 0; border-left: none;">
                        <div class="saic-comment-avatar" style="flex-shrink: 0; margin-top: 3px;">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="#b0b4b8" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12"/>
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/>
                            </svg>
                        </div>
                        <div class="saic-comment-content" style="flex-grow: 1;">
                            <div class="saic-comment-header" style="margin-bottom: 5px; display: flex; align-items: center; gap: 5px;">
                                <span class="saic-comment-author" style="font-weight: 700; font-size: 16px; color: #000;">${msg.author || 'Tamu'}</span>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#2ecc71" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                ${msg.attendance === 'present' ? '<span style="font-size: 11px; background: #c6f6d5; color: #2f855a; padding: 2px 6px; border-radius: 10px; margin-left: 5px; font-weight: normal;">Hadir</span>' : ''}
                            </div>
                            <div class="saic-comment-text" style="font-size: 16px; color: #111; margin-bottom: 5px;">${msg.comment || msg.Comment || ''}</div>
                            <div class="saic-comment-date" style="font-size: 14px; color: #9da4b0; font-style: italic;">${timeAgo(msg.created_at)}</div>
                        </div>
                    </li>
                `).join('');

                // Update the counter
                const counterSpan = document.querySelector('#saic-link-253216 span');
                if (counterSpan) {
                    counterSpan.textContent = messages.length;
                }
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    }

    // Handle Form Submission
    if (rsvpForm) {
        rsvpForm.onsubmit = async function (e) {
            e.preventDefault();

            const submitBtn = rsvpForm.querySelector('input[type="submit"]');
            const originalBtnValue = submitBtn.value;
            submitBtn.value = "Mengirim...";
            submitBtn.disabled = true;

            const formData = {
                author: document.getElementById('author').value,
                attendance: document.getElementById('attendance').value,
                guest: document.getElementById('guest') ? document.getElementById('guest').value : 1,
                comment: document.getElementById('saic-textarea-253216').value
            };

            try {
                const response = await fetch('/api/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    statusDiv.innerHTML = '<p style="color: green;">Terima kasih! Ucapan Anda telah terkirim.</p>';
                    rsvpForm.reset();
                    loadMessages(); // Refresh list
                } else {
                    throw new Error('Gagal mengirim ucapan.');
                }
            } catch (err) {
                statusDiv.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
            } finally {
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
            }
        };
    }

    // Initial load
    loadMessages();
});
