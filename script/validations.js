//validation rules
export const validation = {
    email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
    ],
    confirmPassword: (password) => [
        v => !!v || 'Confirm Password is required',
        v => v === password || 'Password does not match',
    ]
}
