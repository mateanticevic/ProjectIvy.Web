import { StylesConfig } from 'react-select';
import { useEffect, useState } from 'react';

export const getReactSelectStyles = (isDark: boolean): StylesConfig => {
    const focusStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            ...(isDark ? { backgroundColor: '#212529' } : {}),
            borderColor: state.isFocused ? 'var(--ivy-input-focus-border-color)' : isDark ? '#495057' : provided.borderColor,
            boxShadow: state.isFocused ? 'var(--ivy-input-focus-box-shadow)' : 'none',
            ...(state.isFocused || isDark ? {
                '&:hover': {
                    borderColor: state.isFocused ? 'var(--ivy-input-focus-border-color)' : '#6c757d',
                },
            } : {}),
        }),
    };

    if (!isDark) {
        return focusStyles;
    }

    return {
        ...focusStyles,
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#212529',
            border: '1px solid #495057',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#0d6efd'
                : state.isFocused
                    ? '#343a40'
                    : '#212529',
            color: '#dee2e6',
            '&:active': {
                backgroundColor: '#0d6efd',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#dee2e6',
        }),
        input: (provided) => ({
            ...provided,
            color: '#dee2e6',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#343a40',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#dee2e6',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#dee2e6',
            '&:hover': {
                backgroundColor: '#495057',
                color: '#fff',
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#6c757d',
            '&:hover': {
                color: '#dee2e6',
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: '#6c757d',
            '&:hover': {
                color: '#dee2e6',
            },
        }),
        loadingIndicator: (provided) => ({
            ...provided,
            color: '#6c757d',
        }),
    };
};

// Helper to check if dark theme is active
export const isDarkTheme = (): boolean => {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
};

// React hook to get react-select styles that updates when theme changes
export const useReactSelectStyles = (): StylesConfig => {
    const [isDark, setIsDark] = useState(isDarkTheme());

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(isDarkTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return getReactSelectStyles(isDark);
};

