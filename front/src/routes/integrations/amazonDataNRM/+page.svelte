<script>
	import axios from 'axios';
    import { onMount } from 'svelte';
    import { Container } from '@sveltestrap/sveltestrap';

async function fetchAmazonData() {
    
    const options = {
        method: 'GET',
        url: 'https://real-time-amazon-data.p.rapidapi.com/best-sellers',
        params: {
            category: '<REQUIRED>',
            page: '1',
            country: 'US'
        },
        headers: {
            'X-RapidAPI-Key': '88a523cd96msh3544e0ee37800ebp1845b1jsnf31a7971dadb',
            'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
    };

    try {
    	const response = await axios.request(options);
	    console.log(response.data);
    } catch (error) {
	    console.error(error);
    }

}

onMount(()=> {
    fetchAmazonData();
})
</script>

<Container>
Loading....
</Container>