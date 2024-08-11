// src/lib/api.js
import { supabase } from '$lib/supabaseClient';

// User related functions
export async function getUserRole(userId) {
    const { data, error } = await supabase
        .from('auth.users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data?.role;
}

// Venue related functions
export async function createVenue(venueData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('venues')
        .insert([{ ...venueData, user_id: user.id }])
        .select();

    if (error) throw error;
    return data[0];
}

export async function getUserVenues() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('user_id', user.id);

    if (error) throw error;
    return data;
}

export async function getVenuesByUserId(userId) {
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

export async function updateVenue(venueId, venueData) {
    const { data, error } = await supabase
        .from('venues')
        .update(venueData)
        .eq('id', venueId)
        .select();

    if (error) throw error;
    return data[0];
}

export async function deleteVenue(venueId) {
    const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);

    if (error) throw error;
}

// Performance related functions
export async function uploadThumbnail(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
}

export async function createPerformance(performanceData, thumbnailFile) {
    let thumbnail_url = null;
    if (thumbnailFile) {
        thumbnail_url = await uploadThumbnail(thumbnailFile);
    }

    const { data, error } = await supabase
        .from('performances')
        .insert([{ ...performanceData, thumbnail_url }])
        .select();

    if (error) throw error;
    return data[0];
}


export async function getUserPerformances() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('performances')
        .select(`
        *,
        venues (name)
      `)
        .eq('venues.user_id', user.id);

    if (error) throw error;
    return data;
}

export async function getPerformances() {
    const { data, error } = await supabase
        .from('performances')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getPerformance(id) {
    const { data, error } = await supabase
        .from('performances')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function getPerformancesByVenueId(venueId) {
    const { data, error } = await supabase
        .from('performances')
        .select('*')
        .eq('venue_id', venueId);

    if (error) throw error;
    return data;
}

export async function updatePerformance(id, performanceData, thumbnailFile) {
    let thumbnail_url = performanceData.thumbnail_url;
    if (thumbnailFile) {
        thumbnail_url = await uploadThumbnail(thumbnailFile);
    }

    const { data, error } = await supabase
        .from('performances')
        .update({ ...performanceData, thumbnail_url })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
}

export async function deletePerformance(id) {
    const { error } = await supabase
        .from('performances')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Prediction data related functions
export async function uploadPredictionData(predictionData) {
    const { data, error } = await supabase
        .from('prediction_data')
        .insert(predictionData)
        .select();

    if (error) throw error;
    return data;
}

export async function getPredictionDataByPerformanceId(performanceId) {
    const { data, error } = await supabase
        .from('prediction_data')
        .select('*')
        .eq('performance_id', performanceId);

    if (error) throw error;
    return data;
}

export async function updatePredictionResults(predictionId, results) {
    const { data, error } = await supabase
        .from('prediction_data')
        .update(results)
        .eq('id', predictionId)
        .select();

    if (error) throw error;
    return data[0];
}

// Special query for getting today's predictions
export async function getTodaysPredictions() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('prediction_data')
        .select(`
      *,
      performances (
        name,
        venue_id,
        venues (
          name,
          address
        )
      )
    `)
        .eq('performance_date', today)
        .is('is_training_data', false);

    if (error) throw error;
    return data;
}

